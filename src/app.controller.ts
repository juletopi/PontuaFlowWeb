import { Controller, Get, Param, Render } from '@nestjs/common';
type AnyRecord = Record<string, any>;

@Controller()
export class AppController {
  @Get()
  @Render('pages/projects')
  async getProjects() {
    const projects = await this.loadProjects();

    return {
      title: 'Projetos',
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
      title: 'Visão do Projeto',
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
      title: `Visão do Projeto #${id}`,
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
      title: 'Desenvolvedores',
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
      title: `Desenvolvedores do Projeto #${id}`,
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
      title: 'Tarefas',
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
      title: `Tarefas do Projeto #${id}`,
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
      title: 'Métricas',
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
      title: `Métricas do Projeto #${id}`,
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
      title: 'Configurações',
      breadcrumb: 'Ajustes do projeto e sistema',
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

    const tasksWithLabels = this.enrichTasks(tasks, devs, weeks);
    const rankingWithFallback = ranking.length > 0 ? ranking : this.buildRanking(devs, tasksWithLabels);

    return {
      projectId,
      project,
      devs,
      weeks,
      tasks: tasksWithLabels,
      ranking: rankingWithFallback,
      summary: this.buildSummary({ devs, tasks: tasksWithLabels, ranking: rankingWithFallback }),
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
      title: task.nomeTarefa ?? task.NomeTarefa ?? task.title ?? task.Titulo ?? task.titulo ?? task.name ?? task.Name ?? 'Sem título',
      description: task.descricao ?? task.Descricao ?? task.description ?? '',
      devId: task.devId ?? task.DevId ?? task.developerId ?? task.DeveloperId ?? null,
      weekId: task.weekId ?? task.WeekId ?? task.semanaId ?? task.SemanaId ?? null,
      projectId: task.projectId ?? task.ProjectId ?? projectId ?? null,
      points: this.toNumber(task.pontuacao ?? task.Pontuacao ?? task.points ?? task.pontos ?? task.Points ?? task.Pontos ?? 0),
      startDate: task.dataInicio ?? task.DataInicio ?? task.startDate ?? task.StartDate ?? task.start_date ?? task.createdAt ?? task.CreatedAt ?? '',
      endDate: task.dataFim ?? task.DataFim ?? task.endDate ?? task.EndDate ?? task.end_date ?? '',
      devName: task.devName ?? task.DevName ?? task.developerName ?? task.DeveloperName ?? task.NomeDev ?? task.nomeDev ?? '',
      weekNumber: task.weekNumber ?? task.WeekNumber ?? task.numeroSemana ?? task.NumeroSemana ?? task.numero ?? '',
    }));
  }

  private enrichTasks(tasks: AnyRecord[], devs: AnyRecord[], weeks: AnyRecord[]) {
    const devNameById = new Map<string, string>();
    const weekNumberById = new Map<string, string | number>();

    const hasText = (value: any) => typeof value === 'string' && value.trim().length > 0;

    devs.forEach((dev) => {
      const devId = dev.id ?? dev.Id;
      if (devId !== undefined && devId !== null) {
        devNameById.set(String(devId), dev.name ?? dev.Nome ?? dev.nome ?? '');
      }
    });

    weeks.forEach((week) => {
      const weekId = week.id ?? week.Id;
      if (weekId !== undefined && weekId !== null) {
        weekNumberById.set(String(weekId), week.number ?? week.numeroSemana ?? week.numero ?? week.weekNumber ?? week.WeekNumber ?? '');
      }
    });

    return tasks.map((task) => {
      const devId = task.devId ?? task.DevId ?? task.developerId ?? task.DeveloperId ?? null;
      const weekId = task.weekId ?? task.WeekId ?? task.semanaId ?? task.SemanaId ?? null;

      return {
        ...task,
        devName:
          hasText(task.devName) || hasText(task.DevName) || hasText(task.developerName) || hasText(task.DeveloperName)
            ? task.devName ?? task.DevName ?? task.developerName ?? task.DeveloperName
            : devId !== null && devId !== undefined
              ? devNameById.get(String(devId)) ?? ''
              : '',
        weekNumber:
          hasText(task.weekNumber) || hasText(task.WeekNumber) || hasText(task.numeroSemana) || hasText(task.NumeroSemana)
            ? task.weekNumber ?? task.WeekNumber ?? task.numeroSemana ?? task.NumeroSemana
            : weekId !== null && weekId !== undefined
              ? weekNumberById.get(String(weekId)) ?? ''
              : '',
      };
    });
  }

  private async loadRanking(projectId: string | undefined = undefined) {
    if (!projectId) {
      return [];
    }

    const data = await this.fetchFromCandidates([
      `/api/projects/${projectId}/ranking`,
      `/projects/${projectId}/ranking`,
      `/api/metrics/project/${projectId}/ranking`,
      `/metrics/project/${projectId}/ranking`,
    ]);

    const source = this.getCollection(data, ['ranking', 'data', 'items']);

    return source.map((item: AnyRecord, index: number) => ({
      id: item.id ?? item.Id ?? item.devId ?? item.DevId ?? index + 1,
      devId: item.devId ?? item.DevId ?? null,
      name: item.nome ?? item.Nome ?? item.name ?? item.Name ?? item.devName ?? item.DevName ?? 'Sem nome',
      role: item.cargo ?? item.Cargo ?? item.role ?? item.Role ?? item.position ?? item.Position ?? '',
      totalPoints: this.toNumber(item.totalPontos ?? item.totalPoints ?? item.TotalPoints ?? item.pontos ?? item.Pontos ?? item.points ?? item.Points ?? 0),
      performance: this.toNumber(
        item.aproveitamentoPercent ?? item.aproveitamento ?? item.Aproveitamento ?? item.performance ?? item.Performance ?? item.percentage ?? item.Percentage ?? item.percentual ?? item.Percentual ?? 0,
      ),
    }));
  }

  private buildRanking(devs: AnyRecord[], tasks: AnyRecord[]) {
    const totalsByDevId = new Map<string, { totalPoints: number; taskCount: number }>();

    tasks.forEach((task) => {
      const devId = task.devId ?? task.DevId ?? task.developerId ?? task.DeveloperId;

      if (devId === undefined || devId === null || devId === '') {
        return;
      }

      const key = String(devId);
      const current = totalsByDevId.get(key) ?? { totalPoints: 0, taskCount: 0 };

      current.totalPoints += this.toNumber(task.points ?? task.pontos ?? task.Pontos ?? task.totalPoints ?? 0);
      current.taskCount += 1;
      totalsByDevId.set(key, current);
    });

    return devs
      .map((dev: AnyRecord) => {
        const devId = dev.id ?? dev.Id;
        const metrics = devId !== undefined && devId !== null ? totalsByDevId.get(String(devId)) : undefined;
        const totalPoints = metrics?.totalPoints ?? 0;
        const taskCount = metrics?.taskCount ?? 0;
        const performance = taskCount > 0 ? (totalPoints / (taskCount * 5)) * 100 : 0;

        return {
          id: devId,
          devId,
          name: dev.name ?? dev.Nome ?? dev.nome ?? 'Sem nome',
          role: dev.role ?? dev.cargo ?? dev.Cargo ?? dev.position ?? dev.Position ?? '',
          totalPoints,
          performance,
        };
      })
      .sort((left, right) => right.totalPoints - left.totalPoints || right.performance - left.performance);
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
      ? ranking.reduce((sum, item) => sum + this.toNumber(item.performance ?? item.aproveitamentoPercent ?? item.aproveitamento ?? item.percentage ?? 0), 0) / ranking.length
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
