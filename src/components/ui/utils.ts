import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Generates a Student ID in the format: "IB" + YY + NNNN
 * Example: IB260001
 * 
 * @param year - The 4-digit year or 2-digit year string
 * @param sequence - The sequence number (1, 2, 3...)
 */
export function generateStudentId(year: number | string, sequence: number): string {
  const yearStr = year.toString().slice(-2);
  const sequenceStr = sequence.toString().padStart(4, '0');
  return `IB${yearStr}${sequenceStr}`;
}
