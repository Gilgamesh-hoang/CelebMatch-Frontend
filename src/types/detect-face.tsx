interface Singer {
    name: string;
    birthDate: string;
    biography: string;
  }
  
  interface FaceDetection {
    singer: Singer;
    confidence: number;
    boundingBox: {
      x: number;
      y: number;
      width: number;
      height: number;
    };
  }
  
  interface DetectionResponse {
    detections: FaceDetection[];
  }