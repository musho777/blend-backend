export class Banner {
  constructor(
    public readonly id: string,
    public image: string,
    public url: string,
    public text: string | null,
    public textAm: string = '',
    public textRu: string = '',
    public isActive: boolean,
    public priority: number,
    public readonly createdAt?: Date,
    public readonly updatedAt?: Date,
  ) {}

  updateImage(image: string): void {
    this.image = image;
  }

  updateUrl(url: string): void {
    this.url = url;
  }

  updateText(text: string | null): void {
    this.text = text;
  }

  updateTextAm(textAm: string): void {
    this.textAm = textAm;
  }

  updateTextRu(textRu: string): void {
    this.textRu = textRu;
  }

  updatePriority(priority: number): void {
    this.priority = priority;
  }

  toggleActive(): void {
    this.isActive = !this.isActive;
  }

  setActive(isActive: boolean): void {
    this.isActive = isActive;
  }
}
