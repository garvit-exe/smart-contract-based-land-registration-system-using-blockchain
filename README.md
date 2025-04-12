
# Blockchain-Based Land Registry

## Project Overview

This is a comprehensive blockchain-based land registry management system that leverages distributed ledger technology to provide secure, transparent, and efficient property ownership verification and transfer. The system addresses critical challenges in traditional land registry systems, including fraud prevention, transparency issues, and inefficient record-keeping processes.

## Architecture

### Tech Stack

* **Frontend**: React 18.3.1 with TypeScript for type safety and enhanced developer experience
* **Build Tool**: Vite for fast development and optimized production builds
* **Styling**: Tailwind CSS with shadcn/ui component library for responsive design
* **State Management**: React Context API for global state and authentication
* **Data Fetching**: TanStack Query (React Query) v5 for efficient data fetching and caching
* **Blockchain Integration**: Ethereum blockchain using ethers.js v5
* **Backend & Authentication**: Supabase for database, authentication, and storage
* **UI Enhancements**: Sonner for toast notifications, Lucide React for iconography

### System Architecture

The system follows a three-tier architecture:

1. **Presentation Layer**: React-based UI components organized in a modular pattern
2. **Application Layer**: React hooks and context providers for business logic
3. **Data Layer**: 
   - Supabase for relational data storage and user authentication
   - Ethereum blockchain for immutable property records and transactions

### Authentication Flow

We implemented a custom authentication system using Supabase that includes:

1. Session persistence using Supabase Auth
2. Role-based access control (owner vs. official)
3. Protected routes with authentication verification
4. Session recovery mechanisms

## Database Schema

### Core Tables

1. **users**:
   - Stores user profile information
   - Connected to Supabase Auth system
   - Contains roles and wallet information

2. **properties**:
   - Stores property information (title, location, size, price)
   - Contains document hashes that link to blockchain records
   - Includes geographical coordinates for map visualization

3. **transactions**:
   - Records all property transfers and registrations
   - Stores blockchain transaction details (tx_hash, block_number)
   - Maintains property ownership history

## Blockchain Integration

### Smart Contract Architecture

The system utilizes Ethereum smart contracts written in Solidity that handle:

1. **Property Registration**: Only verified government officials can register properties
2. **Ownership Transfer**: Transfer of property between parties with validation
3. **Document Verification**: Validation of property documents using cryptographic hashes
4. **History Tracking**: Immutable record of all property transactions

## Key Components

### Protected Routes

We implemented two levels of access control:
1. **ProtectedRoute**: Ensures the user is authenticated before accessing protected pages
2. **RoleBasedRoute**: Restricts access based on user roles (owner vs. official)

### Property Management

Property registration and transfer workflows include:
- Document validation and hashing
- Blockchain transaction submission and confirmation
- Database synchronization after successful blockchain transactions
- Role-based access control for official vs. owner actions

## Development Decisions & Alternatives

### Authentication Approach

**Decision**: Custom Supabase authentication with session persistence
**Alternatives Considered**:
- Firebase Authentication
- Web3 Authentication 
- Auth0

**Rationale**: Supabase provided the best balance between ease of implementation, security features, and blockchain integration capabilities.

### Blockchain Network Selection

**Decision**: Ethereum with future compatibility for Layer 2 solutions
**Alternatives Considered**:
- Hyperledger Fabric
- Solana
- Polygon

**Rationale**: Ethereum provided the most robust development environment, tooling support, and community resources.

## Team Contributions

### Technical Team Structure

Our interdisciplinary team combines expertise across blockchain, web development, AI, and security:

- **Rohan Gautam** (Project Manager): Project architecture and workflow management
- **Riya Gupta** (Blockchain Architect): Smart contract infrastructure design
- **Shashidhar Kittur** (Backend Lead): Supabase integration and database design
- **Garvit** (Frontend Lead): Responsive UI and Web3 interface development
- **Uday Upadhyay** (AI & Blockchain Integration Specialist): Chatbot and AI verification systems
- **Shashwat Balodhi** (AI Lead): Document analysis and machine learning models
- **Saiyed Alwaz Hussain** (Blockchain Security Specialist): Smart contract audits and security protocols
- **Chinmay Bhoyar** (Blockchain Development Engineer): Smart contract optimization

## Current Status & Future Roadmap

### Functional Components

- ✅ User authentication with role-based access
- ✅ Property registration by government officials
- ✅ Property details visualization with map integration
- ✅ Transaction history tracking
- ✅ Blockchain integration for property records

### Known Limitations

- ⚠️ Authentication flow has edge cases in session recovery
- ⚠️ Blockchain transaction monitoring needs improved error recovery
- ⚠️ Map visualization requires performance optimization

### Future Enhancements

#### Phase 1 (Q3 2025)
- Implement property mortgage functionality
- Add offline signing capabilities for property transfers
- Enhance document verification with AI-based forgery detection

#### Phase 2 (Q4 2025)
- Deploy to Polygon mainnet for reduced gas costs
- Implement multi-signature approval workflow
- Integrate with government land record APIs

#### Phase 3 (Q1-Q2 2026)
- Implement zk-SNARK privacy features
- Develop mobile applications for field verification
- Create a public API for third-party integration

## Deployment

### Development Environment
```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

### Production Deployment
```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

### Environment Configuration
Required environment variables:
- `VITE_SUPABASE_URL`: Supabase project URL
- `VITE_SUPABASE_ANON_KEY`: Supabase project anon key
- `VITE_ETHEREUM_NETWORK`: Ethereum network to connect to
- `VITE_CONTRACT_ADDRESS`: Deployed smart contract address

## Contributing

1. Fork the repository
2. Create a feature branch 
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

### Coding Standards
- Follow TypeScript best practices with strict typing
- Use functional components with hooks
- Write unit tests for all business logic
- Follow component-focused architecture
- Use Tailwind utility classes for styling

## License

This project is under the MIT License.