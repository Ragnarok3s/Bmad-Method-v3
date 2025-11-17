/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    typedRoutes: true
  },
  transpilePackages: ['@bmad/api-client'],
  env: {
    NEXT_PUBLIC_OTEL_EXPORTER_OTLP_ENDPOINT:
      process.env.NEXT_PUBLIC_OTEL_EXPORTER_OTLP_ENDPOINT ?? '',
    NEXT_PUBLIC_OTEL_EXPORTER_OTLP_HEADERS:
      process.env.NEXT_PUBLIC_OTEL_EXPORTER_OTLP_HEADERS ?? '',
    NEXT_PUBLIC_OTEL_SERVICE_NAME:
      process.env.NEXT_PUBLIC_OTEL_SERVICE_NAME ?? 'bmad-web-app',
    NEXT_PUBLIC_OTEL_SERVICE_NAMESPACE:
      process.env.NEXT_PUBLIC_OTEL_SERVICE_NAMESPACE ?? 'bmad.platform',
    NEXT_PUBLIC_ENVIRONMENT:
      process.env.NEXT_PUBLIC_ENVIRONMENT ?? 'local',
    NEXT_PUBLIC_CORE_API_BASE_URL:
      process.env.NEXT_PUBLIC_CORE_API_BASE_URL ?? 'http://localhost:8000',
    NEXT_PUBLIC_ENABLE_TELEMETRY:
      process.env.NEXT_PUBLIC_ENABLE_TELEMETRY ?? 'true'
  }
};

export default nextConfig;
