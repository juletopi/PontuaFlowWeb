import { Controller, Get, Param, Render } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  @Render('pages/projects')
  async getProjects() {
    const projects = await this.loadProjects();

    return {
      title: 'Projetos - PontuaFlow',
      projects,
    };
  }

  @Get('home')
  @Render('pages/home')
  getHome() {
    return {
      title: 'Visão do Projeto - PontuaFlow',
      breadcrumb: 'Resumo geral do projeto',
      backUrl: '/',
      inProject: true,
    };
  }

  @Get('project/:id')
  @Render('pages/home')
  getProjectHome(@Param('id') id: string) {
    return {
      title: `Visão do Projeto #${id} - PontuaFlow`,
      breadcrumb: `Resumo geral do projeto #${id}`,
      backUrl: '/',
      inProject: true,
      projectId: id,
    };
  }

  @Get('devs')
  @Render('pages/devs')
  getDevs() {
    return {
      title: 'Desenvolvedores - PontuaFlow',
      breadcrumb: 'Lista de desenvolvedores',
      backUrl: '/home',
      inProject: true,
    };
  }

  @Get('tasks')
  @Render('pages/tasks')
  getTasks() {
    return {
      title: 'Tarefas - PontuaFlow',
      breadcrumb: 'Lista de tarefas',
      backUrl: '/home',
      inProject: true,
    };
  }

  @Get('metrics')
  @Render('pages/metrics')
  getMetrics() {
    return {
      title: 'Métricas - PontuaFlow',
      breadcrumb: 'Métricas do projeto',
      backUrl: '/home',
      inProject: true,
    };
  }

  @Get('settings')
  @Render('pages/settings')
  getSettings() {
    return {
      title: 'Configurações - PontuaFlow',
      breadcrumb: 'Ajustes do projeto',
      backUrl: '/home',
      inProject: true,
    };
  }

  private async loadProjects() {
    const apiUrl = (process.env.API_URL || '').trim().replace(/\/$/, '');

    if (!apiUrl) {
      return [];
    }

    try {
      const endpoints = ['/api/Projects', '/api/projects', '/projects'];
      let data: any = null;

      for (const endpoint of endpoints) {
        const response = await fetch(`${apiUrl}${endpoint}`);
        if (!response.ok) {
          continue;
        }

        data = await response.json();
        break;
      }

      if (!data) {
        return [];
      }

      const source = Array.isArray(data) ? data : data.data ?? data.projects ?? [];

      if (!Array.isArray(source)) {
        return [];
      }

      return source.map((project: any) => ({
        id: project.id ?? project.Id,
        name: project.name ?? project.Nome ?? project.nome ?? 'Sem nome',
        description: project.description ?? project.Descricao ?? project.descricao ?? '',
        photo: project.photo ?? project.Foto ?? project.foto ?? '',
        createdAt: project.createdAt ?? project.CreatedAt ?? project.created_at ?? new Date().toISOString(),
      }));
    } catch {
      return [];
    }
  }
}
