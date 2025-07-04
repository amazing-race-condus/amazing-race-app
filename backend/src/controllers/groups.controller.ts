import { Response } from "express"
import { prisma } from "../index"
import { validateName, validateMembers } from "../utils/groupValidators"

export const getAllGroups = async (eventId: number) => {
  const groups = await prisma.group.findMany({
    where : {
      eventId : eventId
    },
    include: {
      penalty: true,
      route: {
        include: {
          routeSteps: {
            orderBy: { checkpointOrder: "asc" },
            include: {
              checkpoint: true
            }
          }
        }
      }
    }
  })
  const groupsWithCheckpoints = groups.map(group => ({
    ...group,
    route: group.route?.routeSteps.map(step => step.checkpoint) ?? []
  }))
  return groupsWithCheckpoints
}

export const getGroupById = async (groupId: number) => {
  const id = groupId
  const group = await prisma.group.findUnique({
    where: { id: id },
    include: {
      penalty: true,
      route: {
        include: {
          routeSteps: {
            orderBy: { checkpointOrder: "asc" },
            include: {
              checkpoint: true
            }
          }
        }
      }
    }
  })
  const groupWithCheckpoints = group
    ? {
      ...group,
      route: group.route?.routeSteps.map(step => step.checkpoint) ?? []
    }
    : null
  return groupWithCheckpoints
}

export const getGroupByNextCheckpointId = async (id: number) => {
  const arrivingGroups = await prisma.group.findMany({ where: { nextCheckpointId: id } })
  return arrivingGroups
}

export const updateNextCheckpoint = async (id: number, nextCheckpointId: number) => {
  if (nextCheckpointId === -1) {
    const now = new Date()
    const arrivingGroup = await prisma.group.update({
      where: { id: id},
      data: {
        nextCheckpointId: null,
        finishTime: now
      },
      include: {
        penalty: true,
        route: {
          include: {
            routeSteps: {
              orderBy: { checkpointOrder: "asc" },
              include: {
                checkpoint: true
              }
            }
          }
        }
      }
    })
    const group = {
      ...arrivingGroup,
      route: arrivingGroup.route?.routeSteps.map(step => step.checkpoint) ?? []
    }
    return group
  } else {
    const arrivingGroup = await prisma.group.update({
      where: { id: id },
      data: {
        nextCheckpointId: nextCheckpointId
      },
      include: {
        penalty: true,
        route: {
          include: {
            routeSteps: {
              orderBy: { checkpointOrder: "asc" },
              include: {
                checkpoint: true
              }
            }
          }
        }
      }
    })
    const group = {
      ...arrivingGroup,
      route: arrivingGroup.route?.routeSteps.map(step => step.checkpoint) ?? []
    }
    return group
  }
}

export const createGroup = async (name: string, members: number, easy: boolean, eventId: number,res: Response) => {
  if (!name || !members) {
    res.status(400).json({ error: "Kaikkia vaadittuja tietoja ei ole annettu"})
    return
  }

  const validName = await validateName(name, res, eventId)
  if (!validName) {
    return
  }

  const validMembers = validateMembers(members, res)
  if (!validMembers) {
    return
  }

  const group = await prisma.group.create({
    data: {
      name: name,
      members: Number(members),
      easy: easy,
      eventId: eventId,
    }
  })
  return group
}

export const deleteGroup = async (groupId: number) => {
  const id = groupId
  const group = await prisma.group.delete({
    where: { id },
  })
  return group
}

export const toggleDNF = async (groupId: number) => {
  const id = groupId
  const existingGroup = await prisma.group.findUnique({
    where: { id },
    select: { dnf: true },
  })

  const toggledGroup = await prisma.group.update({
    where: { id },
    data: { dnf: !existingGroup?.dnf },
    include: {
      penalty: true,
      route: {
        include: {
          routeSteps: {
            orderBy: { checkpointOrder: "asc" },
            include: {
              checkpoint: true
            }
          }
        }
      }
    }
  })

  const group = {
    ...toggledGroup,
    route: toggledGroup.route?.routeSteps.map(step => step.checkpoint) ?? []
  }

  return group
}

export const toggleDisqualified = async (groupId: number) => {
  const id = groupId
  const existingGroup = await prisma.group.findUnique({
    where: { id },
    select: { disqualified: true },
  })

  const toggledGroup = await prisma.group.update({
    where: { id },
    data: { disqualified: !existingGroup?.disqualified },
    include: {
      penalty: true,
      route: {
        include: {
          routeSteps: {
            orderBy: { checkpointOrder: "asc" },
            include: {
              checkpoint: true
            }
          }
        }
      }
    }
  })

  const group = {
    ...toggledGroup,
    route: toggledGroup.route?.routeSteps.map(step => step.checkpoint) ?? []
  }

  return group
}

export const modifyGroup = async (groupId: number, name: string, members: number, easy: boolean, eventId : number, res: Response) => {
  const id = groupId

  const data: Partial<{ name: string, members: number, easy: boolean }> = {}

  const groupToModify = await prisma.group.findUnique({
    where: { id },
  })

  if (!groupToModify) {
    res.status(404).json({ error: "Ryhmää ei löydy" })
    return
  }

  const validName = await validateName(name, res, eventId, groupId)
  if (!validName) {
    return
  }

  const validMembers = validateMembers(members, res)
  if (!validMembers) {
    return
  }

  if (easy !== undefined) data.easy = easy
  if (name !== undefined) data.name = name
  if (members !== undefined) data.members = Number(members)

  const updatedGroup = await prisma.group.update({
    where: { id },
    data,
    include: {
      penalty: true,
      route: {
        include: {
          routeSteps: {
            orderBy: { checkpointOrder: "asc" },
            include: {
              checkpoint: true
            }
          }
        }
      }
    }
  })


  const groupWithCheckpoints = {
    ...updatedGroup,
    route: updatedGroup.route?.routeSteps.map(step => step.checkpoint) ?? []
  }

  return groupWithCheckpoints
}
