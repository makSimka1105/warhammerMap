import { BadRequestException, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { Types } from 'mongoose';

/**
 * Обрабатывает ошибки при работе с MongoDB/Mongoose связанными с неверным id
 * @param error Ошибка, возникшая при выполнении запроса
 * @param id Опционально — id, связанный с запросом
 * @throws BadRequestException если id неверного формата
 */
export function handleInvalidIdError( id?: string | object): void {
  if (typeof id === 'string' && !Types.ObjectId.isValid(id)) {
    throw new BadRequestException(`Invalid id format${id ? `: ${id}` : ''}`);
  } else if (id && typeof id === 'object' && !Types.ObjectId.isValid(id.toString())) {
    throw new BadRequestException(`Invalid id format${id ? `: ${id}` : ''}`);
  }
  
}

/**
 * Обрабатывает ситуацию, когда документ не найден
 * @param result Результат запроса к БД (обычно null если не найден)
 * @param id id по которому искали
 * @throws NotFoundException если документ не найден
 */
export function handleObjNotFound(result: any, id: string | object): void {
  if (!result || result==null) {
    throw new NotFoundException(`Object with id ${id} not found`);
  }
}

/**
 * Универсальный обработчик ошибок для сервисных функций
 * @param error Объект ошибки
 * @throws Возбуждает BadRequestException или InternalServerErrorException с подробным сообщением
 */
export function handleGeneralServerError(error: any): never {
  if (error instanceof BadRequestException || error instanceof NotFoundException) {
    throw error; // уже обработанные исключения пробрасываем выше
  }
  throw new InternalServerErrorException(`Internal server error: ${error.message || error.toString()}`);
}


export function handleGroupsNotValid(groups: string[] | undefined): void {

  if (groups==undefined){
    return
  }
  if (!Array.isArray(groups) || groups.length === 0) {
    throw new BadRequestException(`groups must be a non-empty array of group names ${groups}`);
  }



}

export function handelCheckIfAllGroupsExist(groupsSelfs: any[], groups: string[]): void {

  const foundGroupNames = groupsSelfs.map(g => g.name);
  const notFoundGroups = groups.filter(name => !foundGroupNames.includes(name));
  if (notFoundGroups.length > 0) {
      throw new NotFoundException(`Groups not found: ${notFoundGroups.join(', ')}`);
  }

}