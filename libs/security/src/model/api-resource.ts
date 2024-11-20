export class ApiResource {
  static create(
    method: string,
    path: string,
    isPublic?: boolean,
    authorities?: string[],
  ): ApiResource {
    return new ApiResource(method, path, isPublic ?? false, authorities ?? []);
  }

  static createAuth(
    method: string,
    path: string,
    authorities?: string[],
  ): ApiResource {
    return ApiResource.create(method, path, true, authorities);
  }

  static createPublic(method: string, path: string): ApiResource {
    return ApiResource.create(method, path, true);
  }

  method: string;
  path: string;
  isPublic: boolean;
  authorities: string[];

  constructor(
    method: string,
    path: string,
    isPublic: boolean,
    authorities: string[],
  ) {
    this.method = method;
    this.path = path;
    this.isPublic = isPublic;
    this.authorities = authorities;
  }
}
