import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

export interface IMap {
  data: string;
  width: number;
  height: number;
}

@Injectable({
  providedIn: 'root',
})
export class MapConverterService {
  constructor(private http: HttpClient) {}

  async providePng(mapData: IMap) {
    const w = mapData.width;
    const h = mapData.height;
    var occupancyGrid: any = await this.http.get(mapData.data).toPromise();
    const data = new Uint8ClampedArray(w * h * 4);

    for (let i = 0; i < occupancyGrid.length; i++) {
      switch (occupancyGrid[i]) {
        case -1:
          // Unknown Area
          data[4 * i] = 112; // r
          data[4 * i + 1] = 98; // g
          data[4 * i + 2] = 94; // b
          data[4 * i + 3] = 200; // a
          break;

        case 0:
          // Free Area
          data[4 * i] = 254; // r
          data[4 * i + 1] = 250; // g
          data[4 * i + 2] = 250; // b
          data[4 * i + 3] = 255; // a
          break;

        case 100:
          // Busy Area
          data[4 * i] = 0; // r
          data[4 * i + 1] = 0; // g
          data[4 * i + 2] = 0; // b
          data[4 * i + 3] = 255; // a
          break;

        default:
          data[4 * i] = 255; // r
          data[4 * i + 1] = 0; // g
          data[4 * i + 2] = 0; // b
          data[4 * i + 3] = 255; // a
          break;
      }
    }
    const image = this.getDataUrlFromArr(data, w, h);
    return image;
  }

  private getDataUrlFromArr(arr: Uint8ClampedArray, w: number, h: number) {
    if (typeof w === 'undefined' || typeof h === 'undefined') {
      w = h = Math.sqrt(arr.length / 4);
    }
    const canvas = document.createElement('canvas');
    var ctx = canvas.getContext('2d');
    if (ctx) {
      canvas.width = w;
      canvas.height = h;

      const imgData = ctx.createImageData(w, h);
      imgData.data.set(arr);
      ctx.putImageData(imgData, 0, 0);
      this.flipImage(ctx, canvas);
    }
    return canvas.toDataURL();
  }

  private flipImage(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) {
    ctx.globalCompositeOperation = 'copy';
    ctx.scale(1, -1); // Y flip
    ctx.translate(0, -canvas.height); // so we can draw at 0,0
    ctx.drawImage(canvas, 0, 0);
    // now we can restore the context to defaults if needed
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.globalCompositeOperation = 'source-over';

    // Other algorithm to flip image
    // const data = imgData?.data;
    // Array.from({ length: h }, (val, i) =>
    //   data?.slice(i * w * 4, (i + 1) * w * 4)
    // ).forEach((val, i) => data?.set(val, (h - i - 1) * w * 4));
  }
}
