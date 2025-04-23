
export interface BoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface Artist {
  name?: string;
  image?: string;
  birth_date?: string;
  bio?: string;
  genres?: string[];
}

export interface Singer {
  songs?: any[] | undefined; 
  awards?: any[] | undefined; 
}

export interface Detection {
  bounding_box: BoundingBox;
  confidence: number;
  artist?: Artist;
  singer?: Singer;
}