import { Material, MeshLambertMaterial } from 'three';
import { IFCModel } from '../../components/IFCModel';
import { GeometryReconstructor, SerializedGeometry } from './Geometry';
import { MaterialReconstructor, SerializedMaterial } from './Material';

export class SerializedMesh {

    modelID: number;
    geometry: SerializedGeometry;
    materials: SerializedMaterial [] = [];

    constructor(model: IFCModel) {
        this.modelID = model.modelID;
        this.geometry = new SerializedGeometry(model.geometry);
        if (Array.isArray(model.material)) {
            model.material.forEach(mat => {
                this.materials.push(new SerializedMaterial(mat as MeshLambertMaterial));
            });
        } else {
            this.materials.push(new SerializedMaterial(model.material as MeshLambertMaterial));
        }
    }
}

export class MeshReconstructor {

    static new(serialized: SerializedMesh) {
        const model = new IFCModel(serialized.modelID,
          GeometryReconstructor.new(serialized.geometry));
        MeshReconstructor.getMaterials(serialized, model);
        return model;
    }

    private static getMaterials(serialized: SerializedMesh, model: IFCModel) {
        model.material = [];
        const mats = model.material as Material[];
        serialized.materials.forEach(mat => {
            mats.push(MaterialReconstructor.new(mat));
        });
    }
}