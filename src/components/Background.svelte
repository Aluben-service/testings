<script lang="ts">
  import Particles, { particlesInit } from '@tsparticles/svelte';
  import { loadSlim } from "@tsparticles/slim";
  import type { ISourceOptions, Engine } from "@tsparticles/engine";
    let particlesUrl = 'http://foo.bar/particles.json'; // placeholder, replace it with a real url

const themes = {
  nord: {
    colors: {
      background: "#2e3440", // Dark background (Nord theme)
      particleColor: "#88c0d0", // Nordic Blue for particles
      lightGradientStart: "rgba(255, 255, 255, 1)", // Light start of gradient (Nord accent)
      lightGradientStop: "rgba(255, 255, 255, 0)", // Light stop of gradient (Nord accent)
      shadowColor: "rgba(228, 38, 235, 0.5)", // Magenta shadow color
    },
    settings: {
      particlesNumber: 50,
      particleSize: 5,
      opacity: 0.8,
      zIndex: -1,
      lightRadius: 50,
    },
  },
  rosePine: {
    colors: {
      background: "#21202e", // Rose Pine Base
      particleColor: "#9ccfd8", // Rose Pine Foam
      lightGradientStart: "rgba(255, 255, 255, 1)", // Light start of gradient
      lightGradientStop: "rgba(255, 255, 255, 0)", // Light stop of gradient
      shadowColor: "rgba(146, 119, 167, 0.5)", // Rose Pine Highlight Med (semi-transparent)
    },
    settings: {
      particlesNumber: 50,
      particleSize: 5,
      opacity: 0.8,
      zIndex: -1,
      lightRadius: 50,
    },
  },
  rosePineDawn: {
    colors: {
      background: "#f4ede8", // Rose Pine Dawn Base
      particleColor: "#56949f", // Rose Pine Dawn Foam
      lightGradientStart: "rgba(0, 0, 0, 0.5)", // Gradient start color
      lightGradientStop: "rgba(0, 0, 0, 0)", // Gradient stop color
      shadowColor: "rgba(152, 147, 165, 0.5)", // Rose Pine Dawn Muted (semi-transparent)
    },
    settings: {
      particlesNumber: 50,
      particleSize: 5,
      opacity: 0.8,
      zIndex: -1,
      lightRadius: 50,
    },
  },
  rosePineMoon: {
    colors: {
      background: "#232136", // Rose Pine Moon Base
      particleColor: "#c4a7e7", // Rose Pine Moon Iris
      lightGradientStart: "rgba(255, 255, 255, 1)", // Gradient start color
      lightGradientStop: "rgba(255, 255, 255, 0)", // Gradient stop color
      shadowColor: "rgba(144, 140, 170, 0.5)", // Rose Pine Moon Subtle (semi-transparent)
    },
    settings: {
      particlesNumber: 50,
      particleSize: 5,
      opacity: 0.8,
      zIndex: -1,
      lightRadius: 50,
    },
  },
  catppuccinLatte: {
    colors: {
      background: "#eff1f5", // Latte Base
      particleColor: "#dc8a78", // Latte Rosewater
      lightGradientStart: "rgba(0, 0, 0, 0.5)", // Gradient start color
      lightGradientStop: "rgba(0, 0, 0, 0)", // Gradient stop color
      shadowColor: "rgba(181, 191, 226, 0.5)", // Latte Subtle shadow
    },
    settings: {
      particlesNumber: 50,
      particleSize: 5,
      opacity: 0.8,
      zIndex: -1,
      lightRadius: 50,
    },
  },
  catppuccinMacchiato: {
    colors: {
      background: "#24273a", // Macchiato Base
      particleColor: "#f4dbd6", // Macchiato Rosewater
      lightGradientStart: "rgba(255, 255, 255, 1)", // Gradient start color
      lightGradientStop: "rgba(255, 255, 255, 0)", // Gradient stop color
      shadowColor: "rgba(91, 96, 120, 0.5)", // Macchiato Subtle shadow
    },
    settings: {
      particlesNumber: 50,
      particleSize: 5,
      opacity: 0.8,
      zIndex: -1,
      lightRadius: 50,
    },
  },
  catppuccinMocha: {
    colors: {
      background: "#1e1e2e", // Mocha Base
      particleColor: "#f5e0dc", // Mocha Rosewater
      lightGradientStart: "rgba(255, 255, 255, 1)", // Gradient start color
      lightGradientStop: "rgba(255, 255, 255, 0)", // Gradient stop color
      shadowColor: "rgba(88, 91, 112, 0.5)", // Mocha Subtle shadow
    },
    settings: {
      particlesNumber: 50,
      particleSize: 5,
      opacity: 0.8,
      zIndex: -1,
      lightRadius: 50,
    },
  },
  catppuccinFrappe: {
    colors: {
      background: "#292c3c", // Frappe Base
      particleColor: "#f2cdcd", // Frappe Rosewater
      lightGradientStart: "rgba(255, 255, 255, 1)", // Gradient start color
      lightGradientStop: "rgba(255, 255, 255, 0)", // Gradient stop color
      shadowColor: "rgba(88, 91, 112, 0.5)", // Frappe Subtle shadow
    },
    settings: {
      particlesNumber: 50,
      particleSize: 5,
      opacity: 0.8,
      zIndex: -1,
      lightRadius: 50,
    },
  },
};

  const selectedTheme = themes.rosePineMoon;

  const options: ISourceOptions = {
    background: {
      color: selectedTheme.colors.background,
    },
    fullScreen: {
      zIndex: selectedTheme.settings.zIndex,
    },
    particles: {
      number: {
        value: selectedTheme.settings.particlesNumber,
      },
      move: {
        enable: true,
      },
      opacity: {
        value: selectedTheme.settings.opacity,
      },
      size: {
        value: selectedTheme.settings.particleSize,
      },
      light: {
        area: {
          gradient: {
            start: selectedTheme.colors.lightGradientStart,
            stop: selectedTheme.colors.lightGradientStop,
          },
          radius: selectedTheme.settings.lightRadius,
        },
      },
      shadow: {
        enable: true,
        color: selectedTheme.colors.shadowColor,
        blur: 10,
      },
    },
  };

    void particlesInit(async (engine) => {
        await loadSlim(engine);
    });
</script>


<Particles
        id="tsparticles"
        class="put your classes here"
        style=""
        url={particlesUrl}
/>