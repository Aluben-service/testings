self.__uv$config = {
    prefix: '/service/',
    encodeUrl: Ultraviolet.codec.aes.encode,
    decodeUrl: Ultraviolet.codec.aes.decode,
    handler: '/uv/uv.handler.js',
    client: '/uv/uv.client.js',
    bundle: '/uv/uv.bundle.js',
    config: '/uv/uv.config.js',
    sw: '/uv/uv.sw.js',
};