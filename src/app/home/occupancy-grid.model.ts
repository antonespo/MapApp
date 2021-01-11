export class OccupancyGrid {
  header: Header;
  info: Info;
  data: number[];
}

class Header {
  seq: number;
  stamp: {
    secs: number;
    nsecs: number;
  };
  frame_id: string;
}

class Info {
  map_load_time: {
    secs: number;
    nsecs: number;
  };
  resolution: number;
  width: number;
  height: number;
  origin: Origin;
}

class Origin {
  position: {
    x: number;
    y: number;
    z: number;
  };
  orientation: {
    x: number;
    y: number;
    z: number;
  };
}
