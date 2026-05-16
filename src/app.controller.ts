import { Controller, Get, Render } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  @Render('pages/projects')
  getProjects() {
    return {
      title: 'Projetos - PontuaFlow',
      projects: [],
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
}
