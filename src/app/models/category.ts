export interface Category {
  id: number;
  name: string;
  description: string;
}

export function createNewCategory(): Category {
  return {
    id: 0,
    name: '',
    description: ''
  };
}
