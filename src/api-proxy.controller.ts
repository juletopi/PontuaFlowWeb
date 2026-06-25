import { Body, Controller, Delete, HttpStatus, Param, Post, Put, Res } from '@nestjs/common';
import type { Response } from 'express';

@Controller()
export class ApiProxyController {
  private getApiUrl() {
    return (process.env.API_URL || '').trim().replace(/\/$/, '');
  }

  private async forward(path: string, method: string, body?: unknown) {
    const apiUrl = this.getApiUrl();

    if (!apiUrl) {
      return {
        status: HttpStatus.SERVICE_UNAVAILABLE,
        body: { message: 'API_URL não configurada no servidor.' },
      };
    }

    const response = await fetch(`${apiUrl}${path}`, {
      method,
      headers: body === undefined ? undefined : { 'Content-Type': 'application/json' },
      body: body === undefined ? undefined : JSON.stringify(body),
    });

    if (response.status === HttpStatus.NO_CONTENT) {
      return { status: response.status, body: null };
    }

    const contentType = response.headers.get('content-type') || '';

    if (contentType.includes('application/json')) {
      return { status: response.status, body: await response.json() };
    }

    return { status: response.status, body: await response.text() };
  }

  @Post('api/projects')
  async createProject(@Body() body: unknown, @Res() res: Response) {
    const result = await this.forward('/api/Projects', 'POST', body);
    return res.status(result.status).send(result.body);
  }

  @Put('api/projects/:id')
  async updateProject(@Param('id') id: string, @Body() body: unknown, @Res() res: Response) {
    const result = await this.forward(`/api/Projects/${id}`, 'PUT', body);
    return res.status(result.status).send(result.body);
  }

  @Delete('api/projects/:id')
  async deleteProject(@Param('id') id: string, @Res() res: Response) {
    const result = await this.forward(`/api/Projects/${id}`, 'DELETE');
    return res.status(result.status).send(result.body);
  }

  @Post('api/projects/:projectId/devs')
  async createDev(@Param('projectId') projectId: string, @Body() body: unknown, @Res() res: Response) {
    const result = await this.forward(`/api/projects/${projectId}/Devs`, 'POST', body);
    return res.status(result.status).send(result.body);
  }

  @Put('api/projects/:projectId/devs/:devId')
  async updateDev(
    @Param('projectId') projectId: string,
    @Param('devId') devId: string,
    @Body() body: unknown,
    @Res() res: Response,
  ) {
    const result = await this.forward(`/api/projects/${projectId}/Devs/${devId}`, 'PUT', body);
    return res.status(result.status).send(result.body);
  }

  @Delete('api/projects/:projectId/devs/:devId')
  async deleteDev(@Param('projectId') projectId: string, @Param('devId') devId: string, @Res() res: Response) {
    const result = await this.forward(`/api/projects/${projectId}/Devs/${devId}`, 'DELETE');
    return res.status(result.status).send(result.body);
  }

  @Post('api/projects/:projectId/tasks')
  async createTask(@Param('projectId') projectId: string, @Body() body: unknown, @Res() res: Response) {
    const result = await this.forward(`/api/projects/${projectId}/Tasks`, 'POST', body);
    return res.status(result.status).send(result.body);
  }

  @Post('api/projects/:projectId/weeks')
  async createWeek(@Param('projectId') projectId: string, @Body() body: unknown, @Res() res: Response) {
    const result = await this.forward(`/api/projects/${projectId}/Weeks`, 'POST', body);
    return res.status(result.status).send(result.body);
  }

  @Put('api/projects/:projectId/tasks/:taskId')
  async updateTask(
    @Param('projectId') projectId: string,
    @Param('taskId') taskId: string,
    @Body() body: unknown,
    @Res() res: Response,
  ) {
    const result = await this.forward(`/api/projects/${projectId}/Tasks/${taskId}`, 'PUT', body);
    return res.status(result.status).send(result.body);
  }

  @Delete('api/projects/:projectId/tasks/:taskId')
  async deleteTask(@Param('projectId') projectId: string, @Param('taskId') taskId: string, @Res() res: Response) {
    const result = await this.forward(`/api/projects/${projectId}/Tasks/${taskId}`, 'DELETE');
    return res.status(result.status).send(result.body);
  }

  @Post('api/projects/:projectId/teams')
  async createTeam(@Param('projectId') projectId: string, @Body() body: unknown, @Res() res: Response) {
    const result = await this.forward(`/api/projects/${projectId}/teams`, 'POST', body);
    return res.status(result.status).send(result.body);
  }

  @Put('api/projects/:projectId/teams/:teamId')
  async updateTeam(
    @Param('projectId') projectId: string,
    @Param('teamId') teamId: string,
    @Body() body: unknown,
    @Res() res: Response,
  ) {
    const result = await this.forward(`/api/projects/${projectId}/teams/${teamId}`, 'PUT', body);
    return res.status(result.status).send(result.body);
  }

  @Delete('api/projects/:projectId/teams/:teamId')
  async deleteTeam(@Param('projectId') projectId: string, @Param('teamId') teamId: string, @Res() res: Response) {
    const result = await this.forward(`/api/projects/${projectId}/teams/${teamId}`, 'DELETE');
    return res.status(result.status).send(result.body);
  }
}