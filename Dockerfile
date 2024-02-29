FROM node:18-alpine
# ARG SHOPIFY_API_KEY
ENV SHOPIFY_API_KEY=15b3d5117ecb43dab6986a0fcabd972d
EXPOSE 8081
WORKDIR /app
COPY web .
RUN npm install
RUN cd frontend && npm install && npm run build
CMD ["npm", "run", "serve"]