export type AppConfig = {
  apiPrefix: string;
  authenticatedEntryPath: string;
  unAuthenticatedEntryPath: string;
  locale: string;
  accessTokenPersistStrategy: "localStorage" | "sessionStorage" | "cookies";
  enableMock: boolean;
  activeNavTranslation: boolean;
  apiBaseUrl: string;
};

const appConfig: AppConfig = {
  apiPrefix: "/ejat-api/v1",
  apiBaseUrl: "http://localhost:4000",
  authenticatedEntryPath: "/dashboard",
  unAuthenticatedEntryPath: "/sign-in",
  locale: "en",
  accessTokenPersistStrategy: "localStorage",
  enableMock: false,
  activeNavTranslation: true,
};
export default appConfig;
