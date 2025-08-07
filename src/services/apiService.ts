import apiClient from "./apiClient";
import apiFileClient from "./apiFileClient";

interface Entity {
  uuid: string;
}

class ApiService {
  endpoint: string;

  constructor(endpoint: string) {
    this.endpoint = endpoint;
  }

  list<T>(params: unknown, extendedUrl: string = "") {
    const controller = new AbortController();
    const request = apiClient.get(`${this.endpoint}${extendedUrl}`, {
      signal: controller.signal,
      params,
    });

    return { request, cancel: () => controller.abort() };
  }

  listByItem<T>(uuid: string, params: unknown, extendedUrl: string = "") {
    const controller = new AbortController();
    const request = apiClient.get(`${this.endpoint}${extendedUrl}/${uuid}`, {
      signal: controller.signal,
      params,
    });

    return { request, cancel: () => controller.abort() };
  }

  show(uuid: string, extendedUrl: string = "") {
    const controller = new AbortController();
    const request = apiClient.get(
      `${`${this.endpoint}${extendedUrl}`}/${uuid}`,
      {
        signal: controller.signal,
      }
    );

    return { request, cancel: () => controller.abort() };
  }

  create<T>(payload: T, extendedUrl: string = "") {
    return apiClient.post(`${this.endpoint}${extendedUrl}`, payload);
  }

  createFile<T>(payload: T, extendedUrl: string = "") {
    return apiFileClient.post(`${this.endpoint}${extendedUrl}`, payload);
  }

  update<T extends Entity>(payload: T, extendedUrl: string = "") {
    const { uuid, ...details } = payload;
    return apiClient.patch(
      `${`${this.endpoint}${extendedUrl}`}/${uuid}`,
      details
    );
  }
  updateFile(formData: FormData, extendedUrl: string) {
    return apiFileClient.patch(`${this.endpoint}${extendedUrl}`, formData);
  }

  // updateBasicInfo(uuid: string, data: Record<string, any>) {
  //   return apiClient.patch(`/applications/basic-info/${uuid}`, data);
  // }

  updateBasicInfoFile(uuid: string, formData: FormData) {
    return apiFileClient.patch(`/applications/basic-info/${uuid}`, formData);
  }

  updateFileCollaborators(uuid: string, formData: FormData) {
    return apiFileClient.patch(`${this.endpoint}/${uuid}`, formData);
  }

  // updateFileCollaborators(uuid: string, members: string[]) {
  //   return apiFileClient.patch(
  //     `/applications/${uuid}`,
  //     { members },
  //     {
  //       transformRequest: [(data) => JSON.stringify(data)],
  //     }
  //   );
  // }

  delete(uuid: string, extendedUrl: string = "") {
    return apiClient.delete(`${`${this.endpoint}${extendedUrl}`}/${uuid}`);
  }
}

const create = (endpoing: string) => new ApiService(endpoing);

export default create;
