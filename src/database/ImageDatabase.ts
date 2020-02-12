import { Image } from "./ImageModel";

export interface ImageDatabase {
    saveImage(image: Image): Promise<Image>
    clearImages(): Promise<void>
    findImages(image: Partial<Image>): Promise<Image[]>
    deleteImage(uuid: String): Promise<void>
    searchImage(query: any): Promise<Image[]>
}