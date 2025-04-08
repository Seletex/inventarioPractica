import EditorEventos from "../../domain/puertos/EditorEventos";
import {EventEmitter} from "events";

export default class EmisorEventos extends EditorEventos {
    constructor(){
        super();
        this.eventEmitter = new EventEmitter();
    }
    async publicar(evento, datos) {
        this.eventEmitter.emit(evento, datos);
    }
}