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
    particlesInit: (engine: Engine) => Promise<void>;
    $scriptCopy: (script: string) => Promise<Uint8Array>;
}