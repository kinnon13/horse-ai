// AuditorFileUtils.ts (30 lines) - Single responsibility: File utilities
import fs from 'fs';

export class AuditorFileUtils {
  static checkFileSizes(): string[] {
    const largeFiles: string[] = [];
    const files = this.getAllTsFiles('src');
    
    files.forEach(file => {
      const content = fs.readFileSync(file, 'utf8');
      const lines = content.split('\n').length;
      if (lines > 50) {
        largeFiles.push(`${file} (${lines} lines)`);
      }
    });

    return largeFiles;
  }

  private static getAllTsFiles(dir: string): string[] {
    const files: string[] = [];
    const items = fs.readdirSync(dir);
    
    items.forEach(item => {
      const path = `${dir}/${item}`;
      const stat = fs.statSync(path);
      
      if (stat.isDirectory()) {
        files.push(...this.getAllTsFiles(path));
      } else if (item.endsWith('.ts') || item.endsWith('.tsx')) {
        files.push(path);
      }
    });

    return files;
  }
}
