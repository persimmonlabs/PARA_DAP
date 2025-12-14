import { NextRequest, NextResponse } from 'next/server';
import { getItems, createItem } from '@/lib/queries';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const projectId = searchParams.get('projectId') || undefined;
    const area = searchParams.get('area') || undefined;
    const inbox = searchParams.get('inbox') === 'true';
    const today = searchParams.get('today') === 'true';
    const overdue = searchParams.get('overdue') === 'true';

    const items = getItems({
      projectId,
      area,
      inbox,
      today,
      overdue,
    });

    return NextResponse.json(items);
  } catch (error) {
    console.error('GET /api/items error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch items' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.title || typeof body.title !== 'string') {
      return NextResponse.json(
        { error: 'Title is required and must be a string' },
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

    const item = createItem({
      title: body.title,
      notes: body.notes,
      project_id: body.project_id,
      area: body.area,
      due_date: body.due_date,
      completed_at: body.completed_at,
      archived_at: body.archived_at,
    });

    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    console.error('POST /api/items error:', error);
    return NextResponse.json(
      { error: 'Failed to create item' },
      { status: 500 }
    );
  }
}
