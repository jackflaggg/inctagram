import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UserRepository } from '../../../infrastructure/user/user.repository';
import { InjectModel } from '@nestjs/mongoose';
import { UserEntity, UserModelType } from '../../../domain/user/user.entity';
import { LoginDtoService } from '../../../dto/service/login.dto';

export class ValidateUserCommand {
    constructor(public readonly payload: LoginDtoService) {}
}

@CommandHandler(ValidateUserCommand)
export class ValidateUserUseCase implements ICommandHandler<ValidateUserCommand> {
    constructor(
        private readonly userRepository: UserRepository,
        @InjectModel(UserEntity.name) private userModel: UserModelType,
    ) {}
    async execute(command: ValidateUserCommand) {
        const user = await this.userRepository.findUserByLoginOrEmail(command.payload.loginOrEmail);
        //return user._id.toString();
    }
}
