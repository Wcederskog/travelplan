export interface OverpassElement {
  id: number;
  lat: number;
  lon: number;
  type: string;
  tags: {
    name?: string;
    tourism: string;
  };
}

export interface Destination {
  id: string;
  title: string;
  description: string;
  dateFrom?: Date;
  dateTo?: Date;
  lat: number;
  lng: number;
  mandatory: boolean;
  groupEvent: boolean;
  price: number;
  user?: User;
  icon?: {
    iconUrl: string;
    iconSize: number[];
  };
}

export interface User {
  id: string;
  name: string;
  email: string;
  color?: string;
}

export interface Group {
  id: string;
  name: string;
  description: string;
  adminId: string;
  members: User[];
}
