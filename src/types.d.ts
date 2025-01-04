interface PluginMetaData {
    name: string;
    entryNamespace?: string;
    entryFunction?: string;
    events: string[];
    script: string;
    scriptCopy?: Uint8Array | null;
    style: string;
    description: string;
    id: string;
}

interface Window {
    BareMux: {
        BareMuxConnection: typeof BareMuxConnection;
    }
    __uv$config: {
        encodeUrl: (url: string) => string;
        prefix: string;
    };
	registerSW: () => Promise<void>;
	action: (action: string, frameID: string) => void;
	particlesInit: (engine: Engine) => Promise<void>;
	$scriptCopy: (script: string) => Promise<Uint8Array>;
}
