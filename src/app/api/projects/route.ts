import { NextRequest, NextResponse } from 'next/server';
import { getProjects, createProject } from '@/lib/queries';

export async function GET() {
  try {
    const projects = getProjects();
    return NextResponse.json(projects);
  } catch (error) {
    console.error('GET /api/projects error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch projects' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.name || typeof body.name !== 'string') {
      return NextResponse.json(
        { error: 'Name is required and must be a string' },
        { status: 400 }
      );
    }

    // Validate area if provided
    if (body.area && !['tennis', 'rose', 'professional', 'personal'].includes(body.area)) {
      return NextResponse.json(
        { error: 'Invalid area value' },
        { status: 400 }
      );
    }

    const project = createProject({
      name: body.name,
      emoji: body.emoji,
      area: body.area,
      archived_at: body.archived_at,
    });

    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    console.error('POST /api/projects error:', error);
    return NextResponse.json(
      { error: 'Failed to create project' },
      { status: 500 }
    );
  }
}
