
export interface ValidatorInfo {
  address: string;
  name: string;
  commission: number;
}

export const mockValidators: ValidatorInfo[] = [
  { address: '0x1234...5678', name: 'Core Validator 1', commission: 5 },
  { address: '0x2345...6789', name: 'Core Validator 2', commission: 7 },
  { address: '0x3456...7890', name: 'Core Validator 3', commission: 3 }
];
