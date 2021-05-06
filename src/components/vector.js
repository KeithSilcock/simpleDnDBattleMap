export default class Vector {
  constructor(...components) {
    this.components = components;
  }

  add({ components }) {
    return new Vector(...components.map((component, index) => this.components[index] + component));
  }
  subtract({ components }) {
    return new Vector(...components.map((component, index) => this.components[index] - component));
  }
}
