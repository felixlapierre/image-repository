import { createSchema, Type, typedModel, ExtractProps } from 'ts-mongoose';

const ImageSchema = createSchema({
    name: Type.string({ required: true }),
    base64: Type.string({ required: true }),
    uuid: Type.string({ required: true }),
    visibility: Type.string({ required: true }),
    owner: Type.string({ required: true }),
    ownerName: Type.string({ required: true }),
    description: Type.string({ required: true })
})

const Image = typedModel('Image', ImageSchema);

export const ImageModel = Image;
export type Image = ExtractProps<typeof ImageSchema>;
