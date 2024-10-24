import "./style.css";
import { settingsConfig } from "../data/settingsConfig";

// Generate the settings form dynamically
function generateSettingsForm(config: any) {
  const form = document.getElementById("settingsForm") as HTMLFormElement;
  form.innerHTML = ""; // Clear existing content

  Object.keys(config).forEach(key => {
    const setting = config[key];
    const wrapper = document.createElement("div");
    wrapper.classList.add("form-group"); // Add a class for styling and spacing

    if (setting.type === "details") {
      const details = document.createElement("details");
      const summary = document.createElement("summary");
      summary.innerHTML = setting.summary;
      details.appendChild(summary);
      const content = document.createElement("div");
      content.innerHTML = setting.content;
      details.appendChild(content);
      wrapper.appendChild(details);
    } else if (setting.type === "heading") {
      const heading = document.createElement("h2");
      heading.textContent = setting.label;
      wrapper.appendChild(heading);
    } else if (setting.type === "paragraph") {
      const paragraph = document.createElement("p");
      paragraph.innerHTML = setting.label;
      wrapper.appendChild(paragraph);
    } else {
      // Label
      const label = document.createElement("label");
      label.htmlFor = key;
      label.innerHTML = setting.label;

      // Input element
      let input: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;

      if (setting.type === "select") {
        input = document.createElement("select") as HTMLSelectElement;
        setting.choices.forEach((choice: string) => {
          const option = document.createElement("option");
          option.value = choice;
          option.textContent = choice.charAt(0).toUpperCase() + choice.slice(1);
          input.appendChild(option);
        });
        input.id = key;
        input.setAttribute("aria-labelledby", key); // Associate the label with the input
        wrapper.appendChild(label); // Append label first for select elements
        wrapper.appendChild(input); // Then append input
      } else if (setting.type === "checkbox") {
        input = document.createElement("input");
        input.type = "checkbox";
        input.id = key;
        input.setAttribute("aria-labelledby", key);
        wrapper.appendChild(input); // Append input first for checkbox
        wrapper.appendChild(label); // Then append label
      } else if (setting.type === "textarea") {
        input = document.createElement("textarea") as HTMLTextAreaElement;
        input.id = key;
        input.setAttribute("aria-labelledby", key);
        wrapper.appendChild(label); // Append label first
        wrapper.appendChild(input); // Then append input
      } else if (setting.type === "radio") {
        const fieldset = document.createElement("fieldset");
        const legend = document.createElement("legend");
        legend.textContent = setting.label;
        fieldset.appendChild(legend);

        setting.choices.forEach((choice: string) => {
          const radioWrapper = document.createElement("div");
          input = document.createElement("input");
          input.type = "radio";
          input.name = key; // All radios in the same group share the same name
          input.value = choice;
          input.id = `${key}_${choice}`;

          const radioLabel = document.createElement("label");
          radioLabel.htmlFor = `${key}_${choice}`;
          radioLabel.textContent = choice.charAt(0).toUpperCase() + choice.slice(1);

          radioWrapper.appendChild(input);
          radioWrapper.appendChild(radioLabel);
          fieldset.appendChild(radioWrapper);
        });
        wrapper.appendChild(fieldset);
      } else {
        input = document.createElement("input");
        input.type = "text"; // Default to text input for other types
        input.id = key;
        input.setAttribute("aria-labelledby", key);
        wrapper.appendChild(label); // Append label first
        wrapper.appendChild(input); // Then append input
      }
    }

    // Append the wrapper to the form
    form.appendChild(wrapper);
  });
}

// Load all settings from chrome.storage.sync
async function loadSettings(config: any): Promise<any> {
  return new Promise(resolve => {
    const defaultValues: any = {};
    Object.keys(config).forEach(key => {
      // Skip headings and paragraphs
      if (config[key].type !== "heading" && config[key].type !== "paragraph") {
        defaultValues[key] = config[key].default;
      }
    });

    chrome.storage.sync.get(defaultValues, items => {
      console.log("Loaded settings:", items); // Log loaded settings for debugging
      resolve(items);
    });
  });
}

// Apply loaded settings to the UI
function applySettingsToUI(settings: any) {
  Object.keys(settings).forEach(key => {
    const element = document.getElementById(key) as HTMLInputElement | HTMLSelectElement;

    if (!element) return; // Skip if element is not found

    if (element.type === "checkbox") {
      // Convert string to boolean for checkbox
      element.checked = settings[key] === "true"; // Convert string to boolean
    } else {
      element.value = settings[key];
    }
  });
}

// Save settings to chrome.storage.sync
function saveSettings(key: string, value: any) {
  const setting = { [key]: value };
  chrome.storage.sync.set(setting, () => {
    console.log(`Setting ${key} saved:`, value); // Log saved settings for debugging
  });
}

// Initialize the form and load the settings
async function initSettingsForm() {
  generateSettingsForm(settingsConfig);

  const settings = await loadSettings(settingsConfig);
  applySettingsToUI(settings);

  // Save changes on form input
  const form = document.getElementById("settingsForm") as HTMLFormElement;
  form.addEventListener("change", event => {
    const target = event.target as HTMLInputElement | HTMLSelectElement;
    if (target) {
      let value: any;
      if (target.type === "checkbox") {
        value = target.checked ? "true" : "false"; // Convert boolean to string
      } else {
        value = target.value;
      }
      saveSettings(target.id, value);
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initSettingsForm();

  document.getElementById("refreshButton")?.addEventListener("click", () => {
    // Send a message to the background script to refresh the active tab
    chrome.runtime.sendMessage({ action: "refreshActiveTab" });
  });
});

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
`;
