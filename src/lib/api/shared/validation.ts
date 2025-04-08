import { z } from 'zod';
import { ApiError } from './error';

/**
 * Validates that required fields are present in an object
 * @throws ApiError if any required fields are missing
 */
export function validateRequiredFields<T extends object>(
	data: T,
	requiredFields: (keyof T)[],
	entityName: string = 'record'
): T {
	const missingFields: (keyof T)[] = [];

	for (const field of requiredFields) {
		if (data[field] === undefined || data[field] === null || data[field] === '') {
			missingFields.push(field);
		}
	}

	if (missingFields.length > 0) {
		throw new ApiError(
			`${entityName} is missing required fields: ${missingFields.join(', ')}`,
			400
		);
	}

	return data;
}

/**
 * Validates a date string is in ISO format
 * @throws ApiError if the date is invalid
 */
export function validateDateString(
	dateString: string | undefined,
	fieldName: string = 'date'
): string | undefined {
	if (!dateString) return undefined;

	const date = new Date(dateString);
	if (isNaN(date.getTime())) {
		throw new ApiError(
			`Invalid ${fieldName} format. Expected ISO date string.`,
			400
		);
	}

	return dateString;
}

/**
 * Validates a numeric value is within range
 * @throws ApiError if the value is outside the range
 */
export function validateNumericRange(
	value: number | undefined,
	fieldName: string,
	min?: number,
	max?: number
): number | undefined {
	if (value === undefined) return undefined;

	if (typeof value !== 'number' || isNaN(value)) {
		throw new ApiError(`${fieldName} must be a valid number`, 400);
	}

	if (min !== undefined && value < min) {
		throw new ApiError(`${fieldName} must be at least ${min}`, 400);
	}

	if (max !== undefined && value > max) {
		throw new ApiError(`${fieldName} must be no more than ${max}`, 400);
	}

	return value;
}

/**
 * Validates an email address
 * @throws ApiError if the email is invalid
 */
export function validateEmail(email: string | undefined): string | undefined {
	if (!email) return undefined;

	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	if (!emailRegex.test(email)) {
		throw new ApiError('Invalid email address', 400);
	}

	return email;
}

/**
 * Ensures a string is of the specified length
 * @throws ApiError if the string is too short or too long
 */
export function validateStringLength(
	value: string | undefined,
	fieldName: string,
	minLength?: number,
	maxLength?: number
): string | undefined {
	if (value === undefined) return undefined;

	if (minLength !== undefined && value.length < minLength) {
		throw new ApiError(
			`${fieldName} must be at least ${minLength} characters`,
			400
		);
	}

	if (maxLength !== undefined && value.length > maxLength) {
		throw new ApiError(
			`${fieldName} must be no more than ${maxLength} characters`,
			400
		);
	}

	return value;
}

/**
 * Validates that a value is one of the allowed values
 * @throws ApiError if the value is not in the allowed list
 */
export function validateEnum<T extends string>(
	value: T | undefined,
	allowedValues: readonly T[],
	fieldName: string
): T | undefined {
	if (value === undefined) return undefined;

	if (!allowedValues.includes(value)) {
		throw new ApiError(
			`${fieldName} must be one of: ${allowedValues.join(', ')}`,
			400
		);
	}

	return value;
}

/**
 * Validates data against a Zod schema
 * @throws ApiError if validation fails
 */
export async function withValidation<T extends z.ZodType>(
	schema: T,
	data: unknown
): Promise<z.infer<T>> {
	try {
		return await schema.parseAsync(data);
	} catch (error) {
		if (error instanceof z.ZodError) {
			const errorMessage = error.errors
				.map((e) => `${e.path.join('.')}: ${e.message}`)
				.join(', ');
			throw new ApiError(`Validation error: ${errorMessage}`, 400);
		}
		throw new ApiError('Invalid data provided', 400);
	}
}

/**
 * Base function to create entity-specific validation functions
 */
export function createValidator<T extends object>(
	requiredFields: (keyof T)[],
	entityName: string
) {
	return (data: Partial<T>): Partial<T> => {
		// Cast to any to work with the partial data
		return validateRequiredFields(data as any, requiredFields, entityName) as Partial<T>;
	};
} 