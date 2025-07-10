import { IDEAdapter, GeneratedFile } from './base';
import path from 'path';
import { generateClaudeMd } from '../generators/claudeMd';
import { generateImplementation } from '../generators/implementation';
import { generateProjectStructure } from '../generators/projectStructure';
import { generateUiUx } from '../generators/uiUx';
import { generateBugTracking } from '../generators/bugTracking';
import { generatePRP } from '../generators/prp';

export class ClaudeAdapter extends IDEAdapter {
  get name(): string {
    return 'Claude Code';
  }

  get description(): string {
    return "Anthropic's official CLI for Claude (recommended)";
  }

  get configFiles(): string[] {
    return ['CLAUDE.md', 'Docs/', 'PRPs/'];
  }

  get supportsValidation(): boolean {
    return true;
  }

  get supportsPRP(): boolean {
    return true;
  }

  async generateFiles(outputPath: string): Promise<GeneratedFile[]> {
    const files: GeneratedFile[] = [];
    const docsPath = path.join(outputPath, 'Docs');

    // Generate CLAUDE.md
    files.push({
      path: path.join(outputPath, 'CLAUDE.md'),
      content: await generateClaudeMd(this.config),
      description: 'Main context file for Claude Code',
    });

    // Generate Docs files
    files.push({
      path: path.join(docsPath, 'Implementation.md'),
      content: await generateImplementation(this.config),
      description: 'Staged development plan',
    });

    files.push({
      path: path.join(docsPath, 'project_structure.md'),
      content: await generateProjectStructure(this.config),
      description: 'Project organization guide',
    });

    files.push({
      path: path.join(docsPath, 'UI_UX_doc.md'),
      content: await generateUiUx(this.config),
      description: 'Design specifications',
    });

    files.push({
      path: path.join(docsPath, 'Bug_tracking.md'),
      content: await generateBugTracking(this.config),
      description: 'Bug tracking template',
    });

    // Generate PRPs if enabled
    if (this.config.extras.prp) {
      const prpPath = path.join(outputPath, 'PRPs');
      const projectSlug = this.config.projectName.toLowerCase().replace(/\s+/g, '-');

      files.push({
        path: path.join(prpPath, `${projectSlug}-prp.md`),
        content: await generatePRP(this.config, 'base'),
        description: 'Base implementation PRP',
      });

      // Add planning PRP for complex projects
      if (this.config.timeline === 'enterprise' || this.config.teamSize !== 'solo') {
        files.push({
          path: path.join(prpPath, `${projectSlug}-planning.md`),
          content: await generatePRP(this.config, 'planning'),
          description: 'Architecture planning PRP',
        });
      }
    }

    return files;
  }
}
