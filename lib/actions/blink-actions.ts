import { Blink, blinkSchema } from "@/lib/types/blink"
import { nanoid } from "nanoid"
import { supabase } from "@/lib/supabase-client"
import { PostgrestError } from "@supabase/supabase-js"

export async function createBlink(data: Partial<Blink>): Promise<Blink> {
  try {
    // Parse and validate the Blink data using the schema
    const blink: Blink = blinkSchema.parse({
      ...data,
      id: nanoid(), // Generate a unique ID
      createdAt: new Date().toISOString(), // Set the creation date as ISO string
      updatedAt: new Date().toISOString(), // Set the updated date as ISO string
    })

    // Insert the Blink data into the Supabase database
    const { data: insertedBlink, error } = await supabase
      .from("blinks")
      .insert([blink])
      .select()
      .single()

    if (error) {
      throw new Error(`Supabase Error: ${error.message}`)
    }

    if (!insertedBlink) {
      throw new Error("No data returned after inserting blink")
    }

    // Return the newly created Blink object
    return insertedBlink
  } catch (error) {
    console.error("Error creating blink:", error)
    if (error instanceof Error) {
      throw new Error(`Failed to create blink: ${error.message}`)
    }
    if (typeof error === "object" && error !== null && "details" in error) {
      throw new Error(`Failed to create blink: ${JSON.stringify(error)}`)
    }
    throw new Error("Unexpected error occurred while creating blink")
  }
}

export async function getBlink(id: string): Promise<Blink | null> {
  try {
    const { data, error } = await supabase
      .from("blinks")
      .select("*")
      .eq("id", id)
      .single()

    if (error) {
      throw error
    }

    return data
  } catch (error) {
    console.error("Error fetching blink:", error)
    if (error instanceof PostgrestError) {
      throw new Error(`Failed to fetch blink: ${error.message}`)
    }
    throw new Error("Unexpected error occurred while fetching blink")
  }
}

export async function updateBlink(id: string, data: Partial<Blink>): Promise<Blink> {
  try {
    const updatedData = {
      ...data,
      updatedAt: new Date().toISOString(),
    }

    const { data: updatedBlink, error } = await supabase
      .from("blinks")
      .update(updatedData)
      .eq("id", id)
      .select()
      .single()

    if (error) {
      throw error
    }

    if (!updatedBlink) {
      throw new Error("No data returned after updating blink")
    }

    return updatedBlink
  } catch (error) {
    console.error("Error updating blink:", error)
    if (error instanceof PostgrestError) {
      throw new Error(`Failed to update blink: ${error.message}`)
    }
    throw new Error("Unexpected error occurred while updating blink")
  }
}

export async function deleteBlink(id: string): Promise<void> {
  try {
    const { error } = await supabase
      .from("blinks")
      .delete()
      .eq("id", id)

    if (error) {
      throw error
    }
  } catch (error) {
    console.error("Error deleting blink:", error)
    if (error instanceof PostgrestError) {
      throw new Error(`Failed to delete blink: ${error.message}`)
    }
    throw new Error("Unexpected error occurred while deleting blink")
  }
}

