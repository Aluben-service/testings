interface PluginMetaData {
    name: string;
    entryNamespace?: string;
    entryFunction?: string;
    events?: string[];
    script?: string;
    scriptCopy? : Uint8Array | null;
    style?: string;
    description: string;
}

interface Window {
    $scriptCopy: (script: string) => Promise<Uint8Array>;
}