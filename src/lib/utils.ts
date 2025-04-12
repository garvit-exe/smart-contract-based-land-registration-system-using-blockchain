
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function truncateEthAddress(address?: string, startChars: number = 6, endChars: number = 4): string {
  if (!address) return '';
  if (address.length <= startChars + endChars) return address;
  return `${address.substring(0, startChars)}...${address.substring(address.length - endChars)}`;
}

export function formatDate(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric', 
    month: 'short', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(dateObj);
}

export function calculateTimeAgo(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const seconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000);
  
  let interval = Math.floor(seconds / 31536000);
  if (interval >= 1) {
    return interval === 1 ? `${interval} year ago` : `${interval} years ago`;
  }
  
  interval = Math.floor(seconds / 2592000);
  if (interval >= 1) {
    return interval === 1 ? `${interval} month ago` : `${interval} months ago`;
  }
  
  interval = Math.floor(seconds / 86400);
  if (interval >= 1) {
    return interval === 1 ? `${interval} day ago` : `${interval} days ago`;
  }
  
  interval = Math.floor(seconds / 3600);
  if (interval >= 1) {
    return interval === 1 ? `${interval} hour ago` : `${interval} hours ago`;
  }
  
  interval = Math.floor(seconds / 60);
  if (interval >= 1) {
    return interval === 1 ? `${interval} minute ago` : `${interval} minutes ago`;
  }
  
  return seconds < 10 ? 'just now' : `${Math.floor(seconds)} seconds ago`;
}

export function generateRandomEthAddress(): string {
  return `0x${Array.from({length: 40}, () => Math.floor(Math.random() * 16).toString(16)).join('')}`;
}

export function generateRandomHash(): string {
  return `0x${Array.from({length: 64}, () => Math.floor(Math.random() * 16).toString(16)).join('')}`;
}

