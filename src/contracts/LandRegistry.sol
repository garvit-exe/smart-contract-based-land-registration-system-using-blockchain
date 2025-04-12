
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title LandRegistry
 * @dev Implements a land registry system on the blockchain
 */
contract LandRegistry is Ownable {
    struct Property {
        address owner;
        string location;
        string detailsHash; // IPFS hash or other off-chain storage reference
        bool isRegistered;
        address mortgagedTo; // Address of the lender if property is mortgaged
        uint256 mortgageAmount; // Amount of mortgage if applicable
        uint256 lastValuation; // Last recorded valuation of the property
        bool isVerified; // Additional verification status by trusted validator
    }
    
    // Maps propertyId -> Property
    mapping(string => Property) private properties;
    
    // Track government officials
    mapping(address => bool) public isOfficial;
    
    // Track verified validators (can verify property authenticity)
    mapping(address => bool) public isValidator;
    
    // Track transaction history
    struct Transaction {
        string propertyId;
        address from;
        address to;
        string transactionType; // "registration", "transfer", "mortgage", "verification"
        uint256 timestamp;
        uint256 value; // in wei
    }
    
    // Maps propertyId -> array of transactions
    mapping(string => Transaction[]) private transactionHistory;
    
    // Events
    event PropertyRegistered(string indexed propertyId, address owner, string location, string detailsHash);
    event PropertyTransferred(string indexed propertyId, address indexed previousOwner, address indexed newOwner);
    event PropertyMortgaged(string indexed propertyId, address indexed owner, address indexed lender, uint256 amount);
    event MortgageReleased(string indexed propertyId, address indexed owner, address indexed lender);
    event PropertyVerified(string indexed propertyId, address indexed validator, uint256 timestamp);
    event PropertyValuationUpdated(string indexed propertyId, uint256 previousValue, uint256 newValue);
    
    constructor() {
        // Contract deployer is automatically an official and validator
        isOfficial[msg.sender] = true;
        isValidator[msg.sender] = true;
    }
    
    // Only officials can register properties
    modifier onlyOfficial() {
        require(isOfficial[msg.sender], "Caller is not a government official");
        _;
    }
    
    // Only validators can verify properties
    modifier onlyValidator() {
        require(isValidator[msg.sender], "Caller is not an authorized validator");
        _;
    }
    
    /**
     * @dev Add a new government official
     * @param officialAddress Address of the new official
     */
    function addOfficial(address officialAddress) external onlyOwner {
        isOfficial[officialAddress] = true;
    }
    
    /**
     * @dev Remove a government official
     * @param officialAddress Address of the official to remove
     */
    function removeOfficial(address officialAddress) external onlyOwner {
        require(officialAddress != owner(), "Cannot remove contract owner as official");
        isOfficial[officialAddress] = false;
    }
    
    /**
     * @dev Add a new validator
     * @param validatorAddress Address of the new validator
     */
    function addValidator(address validatorAddress) external onlyOwner {
        isValidator[validatorAddress] = true;
    }
    
    /**
     * @dev Remove a validator
     * @param validatorAddress Address of the validator to remove
     */
    function removeValidator(address validatorAddress) external onlyOwner {
        require(validatorAddress != owner(), "Cannot remove contract owner as validator");
        isValidator[validatorAddress] = false;
    }
    
    /**
     * @dev Register a new property on the blockchain
     * @param propertyId Unique identifier for the property
     * @param initialOwner Address of the property's initial owner
     * @param location Physical location of the property
     * @param detailsHash Hash of property details stored off-chain
     * @param initialValuation Initial property valuation in wei
     */
    function registerProperty(
        string calldata propertyId,
        address initialOwner,
        string calldata location,
        string calldata detailsHash,
        uint256 initialValuation
    ) external onlyOfficial {
        require(!properties[propertyId].isRegistered, "Property already registered");
        
        properties[propertyId] = Property({
            owner: initialOwner,
            location: location,
            detailsHash: detailsHash,
            isRegistered: true,
            mortgagedTo: address(0),
            mortgageAmount: 0,
            lastValuation: initialValuation,
            isVerified: false
        });
        
        // Record transaction
        transactionHistory[propertyId].push(Transaction({
            propertyId: propertyId,
            from: address(0),
            to: initialOwner,
            transactionType: "registration",
            timestamp: block.timestamp,
            value: 0
        }));
        
        emit PropertyRegistered(propertyId, initialOwner, location, detailsHash);
    }
    
    /**
     * @dev Transfer property ownership
     * @param propertyId ID of the property to transfer
     * @param newOwner Address of the new owner
     */
    function transferProperty(string calldata propertyId, address newOwner) external {
        Property storage property = properties[propertyId];
        
        require(property.isRegistered, "Property not registered");
        require(property.owner == msg.sender, "Only owner can transfer property");
        require(newOwner != address(0), "New owner cannot be zero address");
        require(property.mortgagedTo == address(0), "Cannot transfer mortgaged property");
        
        address previousOwner = property.owner;
        property.owner = newOwner;
        
        // Record transaction
        transactionHistory[propertyId].push(Transaction({
            propertyId: propertyId,
            from: previousOwner,
            to: newOwner,
            transactionType: "transfer",
            timestamp: block.timestamp,
            value: msg.value
        }));
        
        emit PropertyTransferred(propertyId, previousOwner, newOwner);
    }
    
    /**
     * @dev Create a mortgage on a property
     * @param propertyId ID of the property to mortgage
     * @param lender Address of the lender
     * @param amount Amount of the mortgage in wei
     */
    function createMortgage(string calldata propertyId, address lender, uint256 amount) external {
        Property storage property = properties[propertyId];
        
        require(property.isRegistered, "Property not registered");
        require(property.owner == msg.sender, "Only owner can mortgage property");
        require(property.mortgagedTo == address(0), "Property already mortgaged");
        require(lender != address(0), "Lender cannot be zero address");
        require(amount > 0, "Mortgage amount must be greater than zero");
        
        property.mortgagedTo = lender;
        property.mortgageAmount = amount;
        
        // Record transaction
        transactionHistory[propertyId].push(Transaction({
            propertyId: propertyId,
            from: msg.sender,
            to: lender,
            transactionType: "mortgage",
            timestamp: block.timestamp,
            value: amount
        }));
        
        emit PropertyMortgaged(propertyId, property.owner, lender, amount);
    }
    
    /**
     * @dev Release a mortgage on a property
     * @param propertyId ID of the property to release from mortgage
     */
    function releaseMortgage(string calldata propertyId) external {
        Property storage property = properties[propertyId];
        
        require(property.isRegistered, "Property not registered");
        require(property.mortgagedTo == msg.sender, "Only lender can release mortgage");
        
        address lender = property.mortgagedTo;
        property.mortgagedTo = address(0);
        property.mortgageAmount = 0;
        
        // Record transaction
        transactionHistory[propertyId].push(Transaction({
            propertyId: propertyId,
            from: lender,
            to: property.owner,
            transactionType: "release",
            timestamp: block.timestamp,
            value: 0
        }));
        
        emit MortgageReleased(propertyId, property.owner, lender);
    }
    
    /**
     * @dev Verify a property by an authorized validator
     * @param propertyId ID of the property to verify
     */
    function verifyProperty(string calldata propertyId) external onlyValidator {
        Property storage property = properties[propertyId];
        
        require(property.isRegistered, "Property not registered");
        require(!property.isVerified, "Property already verified");
        
        property.isVerified = true;
        
        // Record transaction
        transactionHistory[propertyId].push(Transaction({
            propertyId: propertyId,
            from: address(0),
            to: address(0),
            transactionType: "verification",
            timestamp: block.timestamp,
            value: 0
        }));
        
        emit PropertyVerified(propertyId, msg.sender, block.timestamp);
    }
    
    /**
     * @dev Update property valuation
     * @param propertyId ID of the property to update
     * @param newValuation New valuation in wei
     */
    function updateValuation(string calldata propertyId, uint256 newValuation) external onlyValidator {
        Property storage property = properties[propertyId];
        
        require(property.isRegistered, "Property not registered");
        require(newValuation > 0, "Valuation must be greater than zero");
        
        uint256 previousValuation = property.lastValuation;
        property.lastValuation = newValuation;
        
        // Record transaction
        transactionHistory[propertyId].push(Transaction({
            propertyId: propertyId,
            from: address(0),
            to: address(0),
            transactionType: "valuation",
            timestamp: block.timestamp,
            value: newValuation
        }));
        
        emit PropertyValuationUpdated(propertyId, previousValuation, newValuation);
    }
    
    /**
     * @dev Get the owner of a property
     * @param propertyId ID of the property
     * @return Address of the property owner
     */
    function getPropertyOwner(string calldata propertyId) external view returns (address) {
        require(properties[propertyId].isRegistered, "Property not registered");
        return properties[propertyId].owner;
    }
    
    /**
     * @dev Get all details of a property
     * @param propertyId ID of the property
     * @return owner Address of the property owner
     * @return location Physical location of the property
     * @return detailsHash Hash of property details stored off-chain
     * @return isRegistered Whether the property is registered
     * @return mortgagedTo Address of the lender if property is mortgaged
     * @return mortgageAmount Amount of mortgage if applicable
     * @return lastValuation Last recorded valuation of the property
     * @return isVerified Whether the property is verified by a validator
     */
    function getPropertyDetails(string calldata propertyId) external view returns (
        address owner,
        string memory location,
        string memory detailsHash,
        bool isRegistered,
        address mortgagedTo,
        uint256 mortgageAmount,
        uint256 lastValuation,
        bool isVerified
    ) {
        Property memory property = properties[propertyId];
        return (
            property.owner,
            property.location,
            property.detailsHash,
            property.isRegistered,
            property.mortgagedTo,
            property.mortgageAmount,
            property.lastValuation,
            property.isVerified
        );
    }
    
    /**
     * @dev Verify the hash of property details
     * @param propertyId ID of the property
     * @param detailsHash Hash to verify against stored hash
     * @return Whether the provided hash matches the stored hash
     */
    function verifyPropertyDetails(string calldata propertyId, string calldata detailsHash) 
        external view returns (bool) 
    {
        Property memory property = properties[propertyId];
        if (!property.isRegistered) {
            return false;
        }
        
        return keccak256(abi.encodePacked(property.detailsHash)) == 
               keccak256(abi.encodePacked(detailsHash));
    }
    
    /**
     * @dev Get the mortgage status of a property
     * @param propertyId ID of the property
     * @return isMortgaged Whether the property is mortgaged
     * @return lender Address of the lender if mortgaged
     * @return amount Amount of the mortgage
     */
    function getMortgageStatus(string calldata propertyId) external view returns (
        bool isMortgaged,
        address lender,
        uint256 amount
    ) {
        Property memory property = properties[propertyId];
        require(property.isRegistered, "Property not registered");
        
        bool _isMortgaged = property.mortgagedTo != address(0);
        return (
            _isMortgaged,
            property.mortgagedTo,
            property.mortgageAmount
        );
    }
    
    /**
     * @dev Get the verification status of a property
     * @param propertyId ID of the property
     * @return isVerified Whether the property is verified
     */
    function getVerificationStatus(string calldata propertyId) external view returns (bool) {
        Property memory property = properties[propertyId];
        require(property.isRegistered, "Property not registered");
        
        return property.isVerified;
    }
    
    /**
     * @dev Get the transaction history of a property
     * @param propertyId ID of the property
     * @return Array of transactions for the property
     */
    function getTransactionHistory(string calldata propertyId) external view returns (
        Transaction[] memory
    ) {
        require(properties[propertyId].isRegistered, "Property not registered");
        
        return transactionHistory[propertyId];
    }
}
