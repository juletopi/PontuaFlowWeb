import { Controller, Get, Param, Render } from '@nestjs/common';
type AnyRecord = Record<string, any>;

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
  async getHome() {
    const [projects, devs, tasks] = await Promise.all([
      this.loadProjects(),
      this.loadDevs(),
      this.loadTasks(),
    ]);

    return {
      title: 'Visão do Projeto - PontuaFlow',
      breadcrumb: 'Resumo geral do projeto',
      backUrl: '/',
      inProject: true,
      projects,
      devs,
      tasks,
      summary: this.buildSummary({ devs, tasks }),
    };
  }

  @Get('project/:id')
  @Render('pages/home')
  async getProjectHome(@Param('id') id: string) {
    const bundle = await this.loadProjectBundle(id);

    return {
      title: `Visão do Projeto #${id} - PontuaFlow`,
      breadcrumb: `Resumo geral do projeto #${id}`,
      backUrl: '/',
      inProject: true,
      projectId: id,
      ...bundle,
    };
  }

  @Get('devs')
  @Render('pages/devs')
  async getDevs() {
    const devs = await this.loadDevs();

    return {
      title: 'Desenvolvedores - PontuaFlow',
      breadcrumb: 'Lista de desenvolvedores',
      backUrl: '/home',
      inProject: true,
      devs,
    };
  }

  @Get('project/:id/devs')
  @Render('pages/devs')
  async getProjectDevs(@Param('id') id: string) {
    const bundle = await this.loadProjectBundle(id);

    return {
      title: `Desenvolvedores do Projeto #${id} - PontuaFlow`,
      breadcrumb: `Desenvolvedores do projeto #${id}`,
      backUrl: `/project/${id}`,
      inProject: true,
      projectId: id,
      ...bundle,
    };
  }

  @Get('tasks')
  @Render('pages/tasks')
  async getTasks() {
    const [devs, weeks, tasks] = await Promise.all([
      this.loadDevs(),
      this.loadWeeks(),
      this.loadTasks(),
    ]);

    return {
      title: 'Tarefas - PontuaFlow',
      breadcrumb: 'Lista de tarefas',
      backUrl: '/home',
      inProject: true,
      devs,
      weeks,
      tasks,
    };
  }

  @Get('project/:id/tasks')
  @Render('pages/tasks')
  async getProjectTasks(@Param('id') id: string) {
    const bundle = await this.loadProjectBundle(id);

    return {
      title: `Tarefas do Projeto #${id} - PontuaFlow`,
      breadcrumb: `Tarefas do projeto #${id}`,
      backUrl: `/project/${id}`,
      inProject: true,
      projectId: id,
      ...bundle,
    };
  }

  @Get('metrics')
  @Render('pages/metrics')
  async getMetrics() {
    const [devs, tasks, ranking] = await Promise.all([
      this.loadDevs(),
      this.loadTasks(),
      this.loadRanking(),
    ]);

    return {
      title: 'Métricas - PontuaFlow',
      breadcrumb: 'Métricas do projeto',
      backUrl: '/home',
      inProject: true,
      devs,
      tasks,
      ranking,
      summary: this.buildSummary({ devs, tasks, ranking }),
    };
  }

  @Get('project/:id/metrics')
  @Render('pages/metrics')
  async getProjectMetrics(@Param('id') id: string) {
    const bundle = await this.loadProjectBundle(id);

    return {
      title: `Métricas do Projeto #${id} - PontuaFlow`,
      breadcrumb: `Métricas do projeto #${id}`,
      backUrl: `/project/${id}`,
      inProject: true,
      projectId: id,
      ...bundle,
    };
  }

  @Get('settings')
  @Render('pages/settings')
  async getSettings() {
    return {
      title: 'Configurações - PontuaFlow',
      breadcrumb: 'Ajustes do projeto',
      backUrl: '/home',
      inProject: true,
      projects: await this.loadProjects(),
    };
  }

  @Get('project/:id/settings')
  @Render('pages/settings')
  async getProjectSettings(@Param('id') id: string) {
    const bundle = await this.loadProjectBundle(id);

    return {
      title: `Configurações do Projeto #${id} - PontuaFlow`,
      breadcrumb: `Ajustes do projeto #${id}`,
      backUrl: `/project/${id}`,
      inProject: true,
      projectId: id,
      ...bundle,
    };
  }

  private async loadProjects() {
    const data = await this.fetchFromCandidates(['/api/Projects', '/api/projects', '/projects']);
    const source = this.getCollection(data, ['projects', 'data', 'items']);

    return source.map((project: AnyRecord) => ({
      id: project.id ?? project.Id,
      name: project.name ?? project.Nome ?? project.nome ?? 'Sem nome',
      description: project.description ?? project.Descricao ?? project.descricao ?? '',
      photo: project.photo ?? project.Foto ?? project.foto ?? '',
      createdAt: project.createdAt ?? project.CreatedAt ?? project.created_at ?? new Date().toISOString(),
    }));
  }

  private async loadProjectBundle(projectId: string) {
    const [project, devs, weeks, tasks, ranking] = await Promise.all([
      this.loadProject(projectId),
      this.loadDevs(projectId),
      this.loadWeeks(projectId),
      this.loadTasks(projectId),
      this.loadRanking(projectId),
    ]);

    return {
      projectId,
      project,
      devs,
      weeks,
      tasks,
      ranking,
      summary: this.buildSummary({ devs, tasks, ranking }),
    };
  }

  private async loadProject(projectId: string) {
    const data = await this.fetchFromCandidates([
      `/api/Projects/${projectId}`,
      `/api/projects/${projectId}`,
      `/projects/${projectId}`,
    ]);
    const projectData = (data ?? {}) as AnyRecord;

    if (!data) {
      return {
        id: projectId,
        name: `Projeto #${projectId}`,
        description: '',
        createdAt: new Date().toISOString(),
      };
    }

    return {
      id: projectData.id ?? projectData.Id ?? projectId,
      name: projectData.name ?? projectData.Nome ?? projectData.nome ?? `Projeto #${projectId}`,
      description: projectData.description ?? projectData.Descricao ?? projectData.descricao ?? '',
      photo: projectData.photo ?? projectData.Foto ?? projectData.foto ?? '',
      createdAt: projectData.createdAt ?? projectData.CreatedAt ?? projectData.created_at ?? new Date().toISOString(),
    };
  }

  private async loadDevs(projectId?: string) {
    const endpoints = projectId
      ? [
          `/api/projects/${projectId}/devs`,
          `/projects/${projectId}/devs`,
          `/api/devs?projectId=${projectId}`,
          `/devs?projectId=${projectId}`,
          '/api/devs',
          '/devs',
        ]
      : ['/api/devs', '/devs'];

    const data = await this.fetchFromCandidates(endpoints);
    const source = this.getCollection(data, ['devs', 'data', 'items']);

    return source.map((dev: AnyRecord) => ({
      id: dev.id ?? dev.Id,
      name: dev.name ?? dev.Nome ?? dev.nome ?? 'Sem nome',
      role: dev.role ?? dev.cargo ?? dev.Cargo ?? dev.position ?? dev.Position ?? 'Sem cargo',
      email: dev.email ?? dev.Email ?? dev.eMail ?? dev.mail ?? '',
      startDate: dev.startDate ?? dev.StartDate ?? dev.start_date ?? dev.createdAt ?? dev.CreatedAt ?? '',
      avatar: dev.avatar ?? dev.Avatar ?? dev.photo ?? dev.Photo ?? '',
      projectId: dev.projectId ?? dev.ProjectId ?? projectId ?? null,
    }));
  }

  private async loadWeeks(projectId?: string) {
    const endpoints = projectId
      ? [
          `/api/projects/${projectId}/weeks`,
          `/projects/${projectId}/weeks`,
          `/api/weeks?projectId=${projectId}`,
          `/weeks?projectId=${projectId}`,
          '/api/weeks',
          '/weeks',
        ]
      : ['/api/weeks', '/weeks'];

    const data = await this.fetchFromCandidates(endpoints);
    const source = this.getCollection(data, ['weeks', 'data', 'items']);

    return source.map((week: AnyRecord) => ({
      id: week.id ?? week.Id,
      number: week.numeroSemana ?? week.numero ?? week.number ?? week.weekNumber ?? week.WeekNumber ?? 0,
      projectId: week.projectId ?? week.ProjectId ?? projectId ?? null,
    }));
  }

  private async loadTasks(projectId?: string) {
    const endpoints = projectId
      ? [
          `/api/projects/${projectId}/tasks`,
          `/projects/${projectId}/tasks`,
          `/api/tasks?projectId=${projectId}`,
          `/tasks?projectId=${projectId}`,
          '/api/tasks',
          '/tasks',
        ]
      : ['/api/tasks', '/tasks'];

    const data = await this.fetchFromCandidates(endpoints);
    const source = this.getCollection(data, ['tasks', 'data', 'items']);

    return source.map((task: AnyRecord) => ({
      id: task.id ?? task.Id,
      title: task.title ?? task.Titulo ?? task.titulo ?? task.name ?? task.Name ?? 'Sem título',
      description: task.description ?? task.Descricao ?? task.descricao ?? '',
      devId: task.devId ?? task.DevId ?? task.developerId ?? task.DeveloperId ?? null,
      weekId: task.weekId ?? task.WeekId ?? task.semanaId ?? task.SemanaId ?? null,
      projectId: task.projectId ?? task.ProjectId ?? projectId ?? null,
      points: this.toNumber(task.points ?? task.pontos ?? task.Points ?? task.Pontos ?? 0),
      startDate: task.startDate ?? task.StartDate ?? task.start_date ?? task.createdAt ?? task.CreatedAt ?? '',
      endDate: task.endDate ?? task.EndDate ?? task.end_date ?? '',
      devName: task.devName ?? task.DevName ?? task.developerName ?? task.DeveloperName ?? '',
      weekNumber: task.weekNumber ?? task.WeekNumber ?? task.numeroSemana ?? task.numero ?? '',
    }));
  }

  private async loadRanking(projectId: string | undefined = undefined) {
    if (!projectId) {
      return [];
    }

    const data = await this.fetchFromCandidates([
      `/api/metrics/project/${projectId}/ranking`,
      `/metrics/project/${projectId}/ranking`,
    ]);

    const source = this.getCollection(data, ['ranking', 'data', 'items']);

    return source.map((item: AnyRecord, index: number) => ({
      id: item.id ?? item.Id ?? index + 1,
      name: item.name ?? item.Nome ?? item.nome ?? item.devName ?? item.DevName ?? 'Sem nome',
      role: item.role ?? item.cargo ?? item.Cargo ?? item.position ?? item.Position ?? '',
      totalPoints: this.toNumber(item.totalPoints ?? item.TotalPoints ?? item.pontos ?? item.Pontos ?? item.points ?? item.Points ?? 0),
      performance: this.toNumber(
        item.performance ?? item.Performance ?? item.aproveitamento ?? item.Aproveitamento ?? item.percentage ?? item.Percentage ?? item.percentual ?? item.Percentual ?? 0,
      ),
    }));
  }

  private buildSummary({
    devs = [],
    tasks = [],
    ranking = [],
  }: {
    devs?: AnyRecord[];
    tasks?: AnyRecord[];
    ranking?: AnyRecord[];
  }) {
    const totalPoints = tasks.reduce((sum, task) => sum + this.toNumber(task.points ?? task.pontos ?? task.totalPoints ?? 0), 0);
    const averagePerformance = ranking.length
      ? ranking.reduce((sum, item) => sum + this.toNumber(item.performance ?? item.aproveitamento ?? item.percentage ?? 0), 0) / ranking.length
      : 0;

    return {
      totalDevs: devs.length,
      totalTasks: tasks.length,
      totalPoints,
      averagePerformance,
    };
  }

  private getCollection(data: any, candidateKeys: string[]) {
    if (Array.isArray(data)) {
      return data;
    }

    if (!data || typeof data !== 'object') {
      return [];
    }

    for (const key of candidateKeys) {
      if (Array.isArray(data[key])) {
        return data[key];
      }
    }

    return [];
  }

  private async fetchFromCandidates(paths: string[]) {
    const apiUrl = this.getApiUrl();

    if (!apiUrl) {
      return null;
    }

    for (const path of paths) {
      try {
        const response = await fetch(`${apiUrl}${path}`);

        if (!response.ok) {
          continue;
        }

        return await response.json();
      } catch {
        continue;
      }
    }

    return null;
  }

  private getApiUrl() {
    return (process.env.API_URL || '').trim().replace(/\/$/, '');
  }

  private toNumber(value: any) {
    const parsed = Number(value);

    return Number.isFinite(parsed) ? parsed : 0;
  }
}
