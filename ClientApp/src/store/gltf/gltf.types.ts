import { Editor } from "../editor/editor.types";

export enum GLTF_ACTION_TYPES {
    CREATE_START = 'gltf/CREATE_START',
    CREATE_SUCCESS = 'gltf/CREATE_SUCCESS',
    CREATE_FAILED = 'gltf/CREATE_FAILED',
    UPDATE_START = 'gltf/UPDATE_START',
    UPDATE_SUCCESS = 'gltf/UPDATE_SUCCESS',
    UPDATE_FAILED = 'gltf/UPDATE_FAILED',
    DELETE_START = 'gltf/DELETE_START',
    DELETE_SUCCESS = 'gltf/DELETE_SUCCESS',
    DELETE_FAILED = 'gltf/DELETE_FAILED',
    FETCH_SINGLE_START = 'gltf/FETCH_SINGLE_START',
    FETCH_SINGLE_SUCCESS = 'gltf/FETCH_SINGLE_SUCCESS',
    FETCH_SINGLE_FAILED = 'gltf/FETCH_SINGLE_FAILED',
    FETCH_USER_START = 'gltf/FETCH_USER_START',
    FETCH_USER_SUCCESS = 'gltf/FETCH_USER_SUCCESS',
    FETCH_USER_FAILED = 'gltf/FETCH_USER_FAILED',
    FETCH_ALL_START = 'gltf/FETCH_ALL_START',
    FETCH_ALL_SUCCESS = 'gltf/FETCH_ALL_SUCCESS',
    FETCH_ALL_FAILED = 'gltf/FETCH_ALL_FAILED'
};

export type Gltf = {
    gltfId: number | null;
    fileInformation: string | null;
    userId: number;
    shapes: Editor;
}