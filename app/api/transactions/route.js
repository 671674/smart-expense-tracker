import { supabase } from "../../../lib/supabase";

// ADD TRANSACTION
export async function POST(request) {
  try {
    const body = await request.json();

    const { data, error } = await supabase
      .from("Transactions")
      .insert([body])
      .select();

    if (error) {
      return Response.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return Response.json(data, { status: 201 });

  } catch (error) {
    return Response.json(
      { error: error.message },
      { status: 500 }
    );
  }
}


// GET ALL TRANSACTIONS
export async function GET() {
  try {
    const { data, error } = await supabase
      .from("Transactions")
      .select("*")
      .order("date", { ascending: false });

    if (error) {
      return Response.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return Response.json(data, { status: 200 });

  } catch (error) {
    return Response.json(
      { error: error.message },
      { status: 500 }
    );
  }
}


// DELETE TRANSACTION
export async function DELETE(request) {
  try {
    const { id } = await request.json();

    const { data, error } = await supabase
      .from("Transactions")
      .delete()
      .eq("id", id)
      .select();

    if (error) {
      return Response.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return Response.json(data, { status: 200 });

  } catch (error) {
    return Response.json(
      { error: error.message },
      { status: 500 }
    );
  }
}


// UPDATE TRANSACTION
export async function PUT(request) {
  try {
    const body = await request.json();

    const { id, ...updates } = body;

    const { data, error } = await supabase
      .from("Transactions")
      .update(updates)
      .eq("id", id)
      .select();

    if (error) {
      return Response.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return Response.json(data, { status: 200 });

  } catch (error) {
    return Response.json(
      { error: error.message },
      { status: 500 }
    );
  }
}