import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable()
export class ConfigService {

    constructor() { }

    get authApiURI() {
        return `${environment.ssoUrl}/api`;
    }

    get resourceApiURI() {
        return `${environment.apiUrl}`;
    }
}