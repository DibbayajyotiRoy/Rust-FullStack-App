# --- Stage 1: Build the React Frontend ---
FROM oven/bun:latest AS frontend-builder
WORKDIR /app/frontend
# Copy dependency files and install
COPY ./frontend/package.json ./frontend/bun.loc[k] ./
RUN bun install
# Copy source files and build
COPY ./frontend/ .
RUN bun run build

# --- Stage 2: Build the Rust Backend ---
FROM rust:1.91-bookworm AS builder
WORKDIR /app
# Copy Cargo files
COPY ./rust-api/Cargo.toml ./rust-api/Cargo.loc[k] ./
# Build dependencies only (caching layer)
RUN mkdir src && echo "fn main() {}" > src/main.rs && cargo build --release && rm -rf src
# Copy the actual source code
COPY ./rust-api/src ./src
COPY ./rust-api/migrations ./migrations
# Rebuild for real - touch main.rs to ensure it's newer than the cached binary
RUN touch src/main.rs && cargo build --release

# --- Stage 3: Final Image ---
FROM debian:bookworm-slim
WORKDIR /app

# Install necessary runtime libraries for SSL and certificates
RUN apt-get update && apt-get install -y libssl-dev ca-certificates && rm -rf /var/lib/apt/lists/*

# Copy the Rust executable from the builder stage
# Cargo names the binary based on the [package] name in Cargo.toml
COPY --from=builder /app/target/release/rust-api /app/rust-api

# Copy the React build output from the frontend-builder stage
COPY --from=frontend-builder /app/frontend/dist /app/dist

# Expose the API port
EXPOSE 8000

# Set environment variables if needed
ENV DATABASE_URL=${DATABASE_URL}

# Run the backend server
CMD ["/app/rust-api"]
