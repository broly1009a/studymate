import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Skill from '@/models/Skill';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB();

    const skill = await Skill.findById(params.id);

    if (!skill) {
      return NextResponse.json({ error: 'Skill not found' }, { status: 404 });
    }

    return NextResponse.json(skill);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB();

    const body = await req.json();
    const { name, category, level, yearsOfExperience, endorsements } = body;

    const updatedSkill = await Skill.findByIdAndUpdate(
      params.id,
      {
        $set: {
          ...(name && { name }),
          ...(category && { category }),
          ...(level && { level }),
          ...(yearsOfExperience !== undefined && { yearsOfExperience }),
          ...(endorsements !== undefined && { endorsements }),
        },
      },
      { new: true, runValidators: true }
    );

    if (!updatedSkill) {
      return NextResponse.json({ error: 'Skill not found' }, { status: 404 });
    }

    return NextResponse.json(updatedSkill);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB();

    const deletedSkill = await Skill.findByIdAndDelete(params.id);

    if (!deletedSkill) {
      return NextResponse.json({ error: 'Skill not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Skill deleted successfully' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
