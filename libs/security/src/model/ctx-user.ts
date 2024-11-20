export class CtxUser {
  static authenticatedUser(sub: string, scopes?: string[]): CtxUser {
    return new CtxUser(false, sub, scopes);
  }

  static anonymousUser(scopes?: string[]): CtxUser {
    return new CtxUser(true, null, scopes);
  }

  isAnonymous: boolean;
  id: string; // extract from jwt, claim sub
  scopes: string[]; // extract from jwt, claim scope

  constructor(isAnonymous: boolean, id?: string, scopes?: string[]) {
    this.isAnonymous = isAnonymous;
    this.id = id;
    this.scopes = scopes;
  }
}
