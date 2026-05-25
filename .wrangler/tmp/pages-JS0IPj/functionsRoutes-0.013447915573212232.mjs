import { onRequestOptions as __api_media_upload_js_onRequestOptions } from "D:\\Avati Safe Storage-Website\\functions\\api\\media\\upload.js"
import { onRequestPost as __api_media_upload_js_onRequestPost } from "D:\\Avati Safe Storage-Website\\functions\\api\\media\\upload.js"
import { onRequestOptions as __api_leads_js_onRequestOptions } from "D:\\Avati Safe Storage-Website\\functions\\api\\leads.js"
import { onRequestPost as __api_leads_js_onRequestPost } from "D:\\Avati Safe Storage-Website\\functions\\api\\leads.js"
import { onRequestOptions as __api_otp_send_ts_onRequestOptions } from "D:\\Avati Safe Storage-Website\\functions\\api\\otp-send.ts"
import { onRequestPost as __api_otp_send_ts_onRequestPost } from "D:\\Avati Safe Storage-Website\\functions\\api\\otp-send.ts"
import { onRequestOptions as __api_otp_verify_ts_onRequestOptions } from "D:\\Avati Safe Storage-Website\\functions\\api\\otp-verify.ts"
import { onRequestPost as __api_otp_verify_ts_onRequestPost } from "D:\\Avati Safe Storage-Website\\functions\\api\\otp-verify.ts"
import { onRequestOptions as __api_zoho_form_submit_ts_onRequestOptions } from "D:\\Avati Safe Storage-Website\\functions\\api\\zoho-form-submit.ts"
import { onRequestPost as __api_zoho_form_submit_ts_onRequestPost } from "D:\\Avati Safe Storage-Website\\functions\\api\\zoho-form-submit.ts"
import { onRequestGet as __api_zoho_proxy_ts_onRequestGet } from "D:\\Avati Safe Storage-Website\\functions\\api\\zoho-proxy.ts"
import { onRequestOptions as __api_zoho_proxy_ts_onRequestOptions } from "D:\\Avati Safe Storage-Website\\functions\\api\\zoho-proxy.ts"
import { onRequestPost as __api_zoho_proxy_ts_onRequestPost } from "D:\\Avati Safe Storage-Website\\functions\\api\\zoho-proxy.ts"
import { onRequestOptions as __api_zoho_token_ts_onRequestOptions } from "D:\\Avati Safe Storage-Website\\functions\\api\\zoho-token.ts"
import { onRequestPost as __api_zoho_token_ts_onRequestPost } from "D:\\Avati Safe Storage-Website\\functions\\api\\zoho-token.ts"

export const routes = [
    {
      routePath: "/api/media/upload",
      mountPath: "/api/media",
      method: "OPTIONS",
      middlewares: [],
      modules: [__api_media_upload_js_onRequestOptions],
    },
  {
      routePath: "/api/media/upload",
      mountPath: "/api/media",
      method: "POST",
      middlewares: [],
      modules: [__api_media_upload_js_onRequestPost],
    },
  {
      routePath: "/api/leads",
      mountPath: "/api",
      method: "OPTIONS",
      middlewares: [],
      modules: [__api_leads_js_onRequestOptions],
    },
  {
      routePath: "/api/leads",
      mountPath: "/api",
      method: "POST",
      middlewares: [],
      modules: [__api_leads_js_onRequestPost],
    },
  {
      routePath: "/api/otp-send",
      mountPath: "/api",
      method: "OPTIONS",
      middlewares: [],
      modules: [__api_otp_send_ts_onRequestOptions],
    },
  {
      routePath: "/api/otp-send",
      mountPath: "/api",
      method: "POST",
      middlewares: [],
      modules: [__api_otp_send_ts_onRequestPost],
    },
  {
      routePath: "/api/otp-verify",
      mountPath: "/api",
      method: "OPTIONS",
      middlewares: [],
      modules: [__api_otp_verify_ts_onRequestOptions],
    },
  {
      routePath: "/api/otp-verify",
      mountPath: "/api",
      method: "POST",
      middlewares: [],
      modules: [__api_otp_verify_ts_onRequestPost],
    },
  {
      routePath: "/api/zoho-form-submit",
      mountPath: "/api",
      method: "OPTIONS",
      middlewares: [],
      modules: [__api_zoho_form_submit_ts_onRequestOptions],
    },
  {
      routePath: "/api/zoho-form-submit",
      mountPath: "/api",
      method: "POST",
      middlewares: [],
      modules: [__api_zoho_form_submit_ts_onRequestPost],
    },
  {
      routePath: "/api/zoho-proxy",
      mountPath: "/api",
      method: "GET",
      middlewares: [],
      modules: [__api_zoho_proxy_ts_onRequestGet],
    },
  {
      routePath: "/api/zoho-proxy",
      mountPath: "/api",
      method: "OPTIONS",
      middlewares: [],
      modules: [__api_zoho_proxy_ts_onRequestOptions],
    },
  {
      routePath: "/api/zoho-proxy",
      mountPath: "/api",
      method: "POST",
      middlewares: [],
      modules: [__api_zoho_proxy_ts_onRequestPost],
    },
  {
      routePath: "/api/zoho-token",
      mountPath: "/api",
      method: "OPTIONS",
      middlewares: [],
      modules: [__api_zoho_token_ts_onRequestOptions],
    },
  {
      routePath: "/api/zoho-token",
      mountPath: "/api",
      method: "POST",
      middlewares: [],
      modules: [__api_zoho_token_ts_onRequestPost],
    },
  ]