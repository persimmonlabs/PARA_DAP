import { NextRequest, NextResponse } from 'next/server';
import { getItem, updateItem, deleteItem } from '@/lib/queries';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const item = getItem(id);

    if (!item) {
      return NextResponse.json(
        { error: 'Item not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(item);
  } catch (error) {
    console.error('GET /api/items/[id] error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch item' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    // Validate area if provided
    if (body.area && !['tennis', 'rose', 'professional', 'personal'].includes(body.area)) {
      return NextResponse.json(
        { error: 'Invalid area value' },
        { status: 400 }
      );
    }

    const item = updateItem(id, body);

    if (!item) {
      return NextResponse.json(
        { error: 'Item not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(item);
  } catch (error) {
    console.error('PATCH /api/items/[id] error:', error);
    return NextResponse.json(
      { error: 'Failed to update item' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const success = deleteItem(id);

    if (!success) {
      return NextResponse.json(
        { error: 'Item not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE /api/items/[id] error:', error);
    return NextResponse.json(
      { error: 'Failed to delete item' },
      { status: 500 }
    );
  }
}
