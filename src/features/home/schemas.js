import { z } from 'zod'
import { email } from '../../shared/schemas/fields'

export const newsletterSchema = z.object({ email })
