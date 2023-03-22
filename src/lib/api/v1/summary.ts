import { Request } from "../Request";

export class GetBasicSummary extends Request {
    protected method = 'GET'

    protected get endpoint(): string {
        return '/summary/basic'
    }
}