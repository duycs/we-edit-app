import { Flow } from "./flow";
import { Setting } from "./setting";

export interface Operation{
    uid: string;
    id: number;
    name: string;
    description: string;
    executionName: string;
    type: number;
    settings: Setting[];
    flow: Flow;

    typename: string;
}