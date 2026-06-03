import { Controller, Get, Render } from '@nestjs/common';

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
      const response = await fetch(`${apiUrl}/projects`);

      if (!response.ok) {
        return [];
      }

      const data: any = await response.json();
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
