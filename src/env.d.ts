/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />
/// <reference types="@clerk/astro/env" />
    interface window {
         AOS: { 
            init(): void;
         } 
        } 